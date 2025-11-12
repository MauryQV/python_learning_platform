import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { avatarUpload } from "../middleware/upload.middleware.js";
import {
  getMe,
  updateMe,
  uploadAvatar,
  deleteAvatar,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", verifyToken, getMe);
router.get("/me", verifyToken, getMe);
router.put("/", verifyToken, updateMe);
router.post("/avatar", verifyToken, avatarUpload, uploadAvatar);
router.delete("/avatar", verifyToken, deleteAvatar);

export default router;
