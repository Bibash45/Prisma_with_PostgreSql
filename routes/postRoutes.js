import { Router } from "express";
import { createPost, deletePost, fetchPost, searchPost, showPost, updatePost } from "../Controller/PostController.js";

const router = Router();

router.get("/", fetchPost);
router.get("/searchpost", searchPost);
router.get("/detail/:id", showPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);


export default router;
