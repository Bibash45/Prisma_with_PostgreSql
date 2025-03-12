import { Router } from "express";

import UserRoutes from "./userRoutes.js";
import PostRoutes from "./postRoutes.js";
import CommentRoutes from "./commentRoutes.js";

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/post", PostRoutes);
router.use("/api/comment", CommentRoutes);

export default router;
