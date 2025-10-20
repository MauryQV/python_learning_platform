import express from "express";
import {
  updateUserRoleController,
  updateUserStatusController,
  findAllUsersController,
} from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch("/users/:id/role", verifyToken, isAdmin, updateUserRoleController);

router.patch(
  "/users/:id/status",
  verifyToken,
  isAdmin,
  updateUserStatusController
);

router.get("/users/", findAllUsersController);

export default router;
