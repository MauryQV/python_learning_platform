// src/routes/teacherPermission.routes.js
import express from "express";
import {
  revokePermissionController,
  assignPermissionController,
  getTeacherPermissionsController
} from "../controllers/teacherPermission.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/:teacherId/permissions",
  getTeacherPermissionsController,
  isAdmin
);

// Solo un admin puede dar/quitar permisos a profesores, implementar el middleware
router.post(
  "/:teacherId/permissions",
  assignPermissionController,
  isAdmin
);

router.delete(
  "/:teacherId/permissions",
  revokePermissionController,
  isAdmin
);

export default router;
