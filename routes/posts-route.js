const express = require('express');

const controller = require('../controllers/posts-controller');
const verifyToken = require('../controllers/verify-token');

const router = express.Router();

router.get('/posts', controller.getAllPosts);

router.get('/posts/:postId', controller.getOnePost);

router.post('/posts', verifyToken, controller.addPost);

router.delete('/posts/:postId', verifyToken, controller.deletePost);

module.exports = router;
