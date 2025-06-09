const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/", postController.createPost);
router.get("/", postController.getAllPosts);
router.put("/:id", postController.updatePost);       // update post by ID
router.delete("/:id", postController.deletePost);



module.exports = router;
