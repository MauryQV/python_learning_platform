import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getProfileController } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", verifyToken, getProfileController);

export default router;
