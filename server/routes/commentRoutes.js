// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', commentController.createComment);
router.get('/post/:postId', commentController.getCommentsByPost);
router.delete('/:id', commentController.deleteComment);
router.put('/:id', commentController.updateComment);
router.get('/', commentController.getAllComments);


module.exports = router;
