import { Router } from "express";
import { createUser, deleteUser, fetchUser, showUser, updateUser } from "../Controller/UserController.js";

const router = Router();

router.get("/", fetchUser);
router.get("/detail/:id", showUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;
