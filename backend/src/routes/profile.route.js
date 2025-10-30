import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getMe, updateMe } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", verifyToken, getMe);
router.put("/", verifyToken, updateMe);

export default router;
