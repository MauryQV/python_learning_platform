import express from "express";
import { updateUserRole } from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth/auth.middleware.js";

const router = express.Router();

// PATCH /admin/users/:id/role
router.patch("/users/:id/role", verifyToken, isAdmin, updateUserRole);

export default router;