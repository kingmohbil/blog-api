// requiring `debug` for the database operations
const debug = require('debug')('database');
// require `jwt` for the authorization
const jwt = require('jsonwebtoken');
// requiring `postsModel` for retrieving and storing the posts
const postsModel = require('../models/posts-model');
// requiring `users` for retrieving and updating the users
const users = require('../models/users-model');
// requiring `comments` for adding and deleting comments
const comments = require('../models/comments-model');
// requiring `body` and `validationResult` for validating the data
const { body, validationResult } = require('express-validator');

//! ------------------------------------ -----------------------------------

exports.getAllPosts = [
  async function (req, res) {
    try {
      const posts = await postsModel
        .find({}, null, {
          sort: { created_at: -1 },
        })
        .populate({
          path: 'author',
          select: { username: 1, _id: 0 },
        })
        .populate({
          path: 'comments',
          select: { author: 1, text: 1, created_at: 1 },
          populate: {
            path: 'author',
            select: { username: 1, _id: 0 },
          },
        });
      debug(posts);
      return res
        .status(200)
        .json({ posts, message: 'posts retrieved successfully' });
    } catch (error) {
      debug(error.message);
      return res.status(404).json({
        errors: [{ msg: error.message }],
        message: 'There is no posts available',
      });
    }
  },
];

//! ------------------------------------ -----------------------------------

exports.getOnePost = async (req, res) => {
  try {
    const post = await postsModel
      .findOne({ _id: req.params.postId })
      .populate({
        path: 'author',
        select: { username: 1, _id: 0 },
      })
      .populate({
        path: 'comments',
        select: { author: 1, text: 1, created_at: 1 },
        populate: {
          path: 'author',
          select: { username: 1, _id: 0 },
        },
      })
      .orFail();
    debug(post);
    return res
      .status(200)
      .json({ posts: [post], message: 'post retrieved successfully' });
  } catch (error) {
    debug(error.message);
    return res.status(404).json({ errors: [{ msg: error.message }] });
  }
};

//! ------------------------------------ -----------------------------------

exports.getUserPosts = (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET_KEY, async (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ errors: [{ msg: err.message }], message: 'token is invalid' });

    try {
      const posts = await postsModel
        .find({ author: user._id }, null, {
          sort: { created_at: -1 },
        })
        .populate({
          path: 'author',
          select: { username: 1, _id: 0 },
        })
        .populate({
          path: 'comments',
          select: { author: 1, text: 1, created_at: 1 },
          populate: {
            path: 'author',
            select: { username: 1, _id: 0 },
          },
        });

      res.json({ posts });
    } catch (error) {}
  });
};

//! ------------------------------------ -----------------------------------

exports.addPost = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('title can`t be empty')
    .isLength({ max: 80 })
    .withMessage('title at most can be 80 characters')
    .escape(),

  //! ------------------------------------ -----------------------------------

  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('text can`t be empty')
    .isLength({ max: 160 })
    .withMessage('text at most can be 160 characters')
    .escape(),

  //! ------------------------------------ -----------------------------------

  async (req, res) => {
    const isValid = validationResult(req);
    if (!isValid.isEmpty())
      return res
        .status(400)
        .json({ errors: isValid.array(), message: 'inputs are invalid' });

    //! ------------------------------------ -----------------------------------

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
        return res.status(200).json({ message: 'post created successfully' });
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

//! ------------------------------------ -----------------------------------

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
      return res.status(200).json({ message: 'post removed successfully' });
    } catch (error) {
      return res.status(404).json({
        errors: [{ msg: error.message }],
        message: `something went wrong`,
      });
    }
  },
];

exports.addComment = [
  //! ------------------------------------ -----------------------------------

  body('text', `comment can't be empty`)
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 160 })
    .withMessage(`comment can't exceed 160 characters`)
    .escape(),

  //! ------------------------------------ -----------------------------------

  function (req, res) {
    const isValid = validationResult(req);
    //! checking for Errors
    if (!isValid.isEmpty()) {
      res.status(400).json({
        errors: isValid.array(),
        message: 'error when validating the inputs',
      });
    }

    //! ------------------------------------ -----------------------------------

    try {
      jwt.verify(req.token, process.env.TOKEN_SECRET_KEY, async (err, user) => {
        if (err) return res.status(403).json({ errors: err.message });
        const comment = new comments({
          post: req.params.postId,
          author: user._id,
          text: req.body.text,
        });
        await postsModel
          .findOneAndUpdate(
            { _id: req.params.postId },
            { $push: { comments: comment._id } }
          )
          .orFail(() => new Error('Post not found'))
          .catch((err) =>
            res.status(404).json({
              errors: [{ msg: err.message }],
              message: `Can't find the post to add the comment`,
            })
          );
        await comment.save();
        return res.status(201).json({ message: 'comment added successfully' });
      });
    } catch (err) {
      return res.status(404).json({
        errors: [{ msg: err.message }],
        message: `Can't find the post to add the comment`,
      });
    }
  },
];

exports.deleteComment = async (req, res) => {
  try {
    await postsModel
      .findOneAndUpdate(
        { _id: req.params.postId },
        { $pull: { comments: req.params.commentId } }
      )
      .orFail();
    await comments.findOneAndDelete({ _id: req.params.commentId }).orFail();
    return res.status(200).json({ message: 'comment deleted successfully' });
  } catch (error) {
    debug(error.message);
    return res.status(404).json({ errors: [{ msg: error.message }] });
  }
};
