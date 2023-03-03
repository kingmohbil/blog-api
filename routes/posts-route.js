const express = require('express');

const controller = require('../controllers/posts-controller');
const verifyToken = require('../controllers/verify-token');

const router = express.Router();

router.get('/', controller.getAllPosts);

router.get('/:postId', controller.getOnePost);

router.post('/', verifyToken, controller.addPost);

router.delete('/:postId', verifyToken, controller.deletePost);

router.post('/:postId/comments', verifyToken, controller.addComment);

router.delete(
  '/:postId/comments/:commentId',
  verifyToken,
  controller.deleteComment
);

module.exports = router;
