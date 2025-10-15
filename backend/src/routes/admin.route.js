import express from "express";
import { updateUserRole, updateUserStatus} from "../controllers/admin.controller.js";
import { verifyToken, isAdmin,} from "../middleware/auth/auth.middleware.js";

const router = express.Router();

router.patch("/users/:id/role", verifyToken, isAdmin, updateUserRole);

router.patch("/users/:id/status", verifyToken, isAdmin, updateUserStatus);
//router.post( "/users/:id/resend-verification", verifyToken, isAdmin, resendVerification);

export default router;
