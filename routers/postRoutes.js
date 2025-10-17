import express from "express";
import * as Post from "../data/post.js";
import * as User from "../data/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json(Post.getPosts());
});

router.get("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found!" });
  }

  res.status(200).json(post);
});

router.post("/", (req, res) => {
  const { userId, title, content } = req.body;
  if (!title || !content) {
    return res.status(403).json({ message: "Invalid credentials!" });
  }

  const user = User.getUserById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  Post.savePost(userId, title, content);

  res.status(201).json({ message: "Post created!" });
});

router.put("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found!" });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(403).json({ message: "Invalid credentials!" });
  }

  Post.updatePost(post.id, title, content);

  res.status(200).json({ message: "Post updated!" });
});

router.delete("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found!" });
  }

  Post.deletePost(post.id);

  return res.status(200).json({ message: "Post deleted!" });
});

//login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials!" });
  }

  const user = User.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, "secret_key", {
    expiresIn: "30m",
  });

  res.json({ token: token });
});

router.get("/my", (req, res) => {});

function auth(req, res, next) {
  const accessToken = req.header.authorize;
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  console.log(accessToken);
  const token = jwt.verify(accessToken, "secret_key");
}

export default router;