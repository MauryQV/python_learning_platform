import express from "express";
import { updateUserRole, updateUserStatus } from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth/auth.middleware.js";

const router = express.Router();

// PATCH /admin/users/:id/role
router.patch("/users/:id/role", verifyToken, isAdmin, updateUserRole);
// PATCH /admin/users/:id/status
router.patch("/users/:id/status", verifyToken, isAdmin, updateUserStatus);

export default router;