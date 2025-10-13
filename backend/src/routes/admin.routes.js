import express from "express";
import { updateUserRole } from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth/auth.middleware.js";
import { resendVerification } from "../controllers/admin.controller.js";

const router = express.Router();

router.patch("/users/:id/role", verifyToken, isAdmin, updateUserRole);
router.post("/users/:id/resend-verification", verifyToken, isAdmin, resendVerification);

export default router;