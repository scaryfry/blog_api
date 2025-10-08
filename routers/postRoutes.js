import { Router } from "express";
import * as Post from "../data/post.js";

const router = Router();

let posts = Post.getPosts();

router.get("/", (req, res) => {
    res.status(200).json(posts);
});

router.get("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

router.post("/", (req,res)=> {
  const {userId,  title, content } = req.body;
  if (!userId || !title || !content) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const post = Post.savePost(userId, title, content)
  res.status(201).json(post)
})

router.put("/:id", (req, res) => {
  const id = +req.params.id;
  const post = Post.getPostById(id)
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const {userId , title, content} = req.body;
  if (!userId || !title || !content) {
    return res.status(400).json({ message: "userId or title or content is missing" });
  }
  const updatePost = Post.updatePost(id, userId, title, content)
  return res.status(200).json(updatePost);
});
router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  Post.deletePost(id)
  res.status(200).json({message: "Post deleted!"})
});

router.use((err, req, res, next) => {
  if (err) res.status(500).json({ error: err.message });
});

export default router;
