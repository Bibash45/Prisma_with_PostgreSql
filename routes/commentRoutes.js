import { Router } from "express";
import { createComment, deleteComment, fetchComment, showComment, updateComment } from "../Controller/CommentController.js";

const router = Router();

router.get("/", fetchComment);
router.get("/detail/:id", showComment);
router.post("/", createComment);
router.delete("/:id", deleteComment);
router.put("/:id", updateComment);

export default router;
