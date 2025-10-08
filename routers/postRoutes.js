import { json, Router } from "express";
import * as Post from "../data/post.js";

const router = Router();

const posts = Post.getPosts();

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
    const {userId, title, content} = req.body;
    if(!userId || !title || !content){
        res.status(404).json({message: "Every field should be filled"})
    }
    const saved = Post.savePost(userId, title, content);
    const post = Post.getPostById(saved.lastInsertRowid);
    res.json(post);

})
router.put("/:id", (req, res) => {
  const id = +req.params.id;
  let post = posts.find(e => e.id == id)
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const { userId, title, content} = req.body;
  if (!userId || !title || !content) {
    return res.status(400).json({ message: "userId or title or content is missing" });
  }
  const index = posts.indexOf(post);
  posts = { ...posts, userId, title, content};
  posts[index] = post;
  return res.status(200).json(post);
});
router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  if (id < 0 || id >= posts.length) {
    return res.status(404).json({ message: "Post not found" });
  }
  posts.splice(id, 1);
  res.status(200).json({ message: "Delete was successful!" });
});

export default router;
