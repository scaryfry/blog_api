import {Router} from "express"
import * as Post from "../data/post.js"

const router = Router();

router.get("/", (req, res) => {
    res.send("Posts")
})
export default router;