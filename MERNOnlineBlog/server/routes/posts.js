const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch posts." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res.json(post);
  } catch (error) {
    return res.status(400).json({ message: "Invalid post id." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const post = await Post.create({ title, author, content });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create post." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, author, content },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res.json(post);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update post." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res.json({ message: "Post deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid post id." });
  }
});

module.exports = router;
