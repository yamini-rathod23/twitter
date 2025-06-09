
const { Post , User} = require("../models");


//createpost
exports.createPost = async (req, res) => {
  try {
    const { post_user_id, post_content } = req.body;

      if (!post_content || post_content.trim().length < 5 || post_content.length > 280) {
      return res.status(400).json({ error: "Post content must be between 5 and 280 characters." });
    }

    const newPost = await Post.create({
      post_user_id,
      post_content
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getall
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { is_deleted: 0 },
      order: [["created_at", "DESC"]],
      include: [{
        model: User,
         as: 'author', 
        attributes: ['USER_ID', 'USER_NAME'],
      }]
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//updatepost
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { post_content } = req.body;

        if (!post_content || post_content.trim().length < 5 || post_content.length > 280) {
      return res.status(400).json({ error: "Post content must be between 5 and 280 characters." });
    }


    const post = await Post.findByPk(id);

    if (!post || post.is_deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.post_content = post_content;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//deletepost

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post || post.is_deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.is_deleted = 1;
    await post.save();

    res.json({ message: "Post deleted (soft delete)" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
