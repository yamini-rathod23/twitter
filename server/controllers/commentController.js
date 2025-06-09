// controllers/commentController.js
const { Comment , User ,Post} = require('../models');

exports.createComment = async (req, res) => {


  try {
    const { comment_post_id, comment_user_id, comment_text } = req.body;

    
    if (!comment_text || comment_text.trim().length < 2 || comment_text.length > 200) {
      return res.status(400).json({ error: "Comment must be between 2 and 200 characters." });
    }

    const newComment = await Comment.create({
      comment_post_id,
      comment_user_id,
      comment_text: comment_text.trim(),
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.findAll({
  where: { 
    is_deleted: 0 ,
    comment_post_id: req.params.postId,

  },
  include: [
    {
      model: User,
      as: 'commenter',
      attributes: ['USER_ID', 'USER_NAME']
    },
    {
      model: Post,
      attributes: ['post_id', 'post_content']
    }
  ],
  order: [['created_at', 'DESC']]
});

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.is_deleted = 1;
    await comment.save();

    res.json({ message: "Comment soft-deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//update
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { comment_text } = req.body;

       if (!comment_text || comment_text.trim().length < 2 || comment_text.length > 200) {
      return res.status(400).json({
        error: "Comment must be between 2 and 200 characters.",
      });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment || comment.is_deleted === 1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.comment_text = comment_text;
    await comment.save();

    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

//getall
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { is_deleted: 0 },
      include: [
        { 
          model: User,
          as: 'commenter',
          // attributes: ['user_id', 'username'] },
           attributes: ['USER_ID', 'USER_NAME']},
        { 
          model: Post, 
          attributes: ['post_id', 'post_content']
         }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};