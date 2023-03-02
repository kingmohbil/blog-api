// requiring `debug` for the database operations
const debug = require('debug')('database');
// require `jwt` for the authorization
const jwt = require('jsonwebtoken');
// requiring `postsModel` for retrieving and storing the posts
const postsModel = require('../models/posts-model');
// requiring `users` for retrieving and updating the users
const users = require('../models/users-model');
// requiring `body` and `validationResult` for validating the data
const { body, validationResult } = require('express-validator');

exports.getAllPosts = [
  async (req, res) => {
    try {
      const posts = await postsModel.find({}, null, {
        sort: { created_at: -1 },
      });
      debug(posts);
      return res.status(200).json({ posts });
    } catch (error) {
      debug(error.message);
      return res.sendStatus(500);
    }
  },
];

exports.getOnePost = async (req, res) => {
  try {
    const post = await postsModel.findOne({ _id: req.params.postId }).orFail();
    debug(post);
    return res.status(200).json({ post });
  } catch (error) {
    debug(error.message);
    return res.sendStatus(404);
  }
};

exports.addPost = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('title can`t be empty')
    .isLength({ max: 80 })
    .withMessage('title at most can be 80 characters')
    .escape(),
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('text can`t be empty')
    .isLength({ max: 160 })
    .withMessage('text at most can be 160 characters')
    .escape(),
  async (req, res) => {
    const isValid = validationResult(req);
    if (!isValid.isEmpty())
      return res
        .status(400)
        .json({ errors: isValid.array(), message: 'inputs are invalid' });
    try {
      const { title, text } = req.body;
      jwt.verify(req.token, process.env.TOKEN_SECRET_KEY, async (err, user) => {
        if (err)
          return res.status(403).json({
            errors: [{ msg: err.message }],
            message: 'token is invalid',
          });
        const post = await postsModel.create({ author: user._id, title, text });
        await users.findOneAndUpdate(
          { _id: user._id },
          { $push: { posts: post._id } }
        );
        return res
          .status(200)
          .json({ errors: [], message: 'post created successfully' });
      });
    } catch (error) {
      debug(error.message);
      return res.status(500).json({
        errors: [{ msg: error.message }],
        message: 'something went wrong while creating the post',
      });
    }
  },
];

exports.deletePost = [
  async (req, res) => {
    try {
      const post = await postsModel
        .findOneAndDelete({
          _id: req.params.postId,
        })
        .orFail();
      await users
        .updateOne({ _id: post.author }, { $pull: { posts: post._id } })
        .orFail();
      return res
        .status(200)
        .json({ errors: [], message: 'post removed successfully' });
    } catch (error) {
      return res
        .status(404)
        .json({
          errors: [{ msg: error.message }],
          message: `something went wrong`,
        });
    }
  },
];
