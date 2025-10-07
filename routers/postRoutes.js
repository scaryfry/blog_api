import { json, Router } from "express";
import * as Post from "../data/post.js";

const router = Router();

router.get("/", (req, res) => {
    const posts = Post.getPosts();
    res.status(200).json(posts);
});

app.get("/:id", (req, res) => {
  const post = Post.getPostById(+req.params.id);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

router.post("/", (req,res)=> {
    const {userId, title, content} = req.body;
    if(!userId || title || content){
        res.status(404).json({message: "Every field should be filled"})
    }
    const saved = Post.savePost(userId, title, content);
    const post = db.getPostById(saved.lastInsertRowid);
    res.json(post);

})

export default router;
