import express from "express";
import {
  createCourseController,
  getAllCoursesController,
  assignTeacherToCourseController,
  removeTeacherFromCourseController,
} from "../controllers/course.controller.js";
import { courseSchemaValidate } from "../middleware/course.middleware.js";
import { hasRole, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-course",verifyToken,hasRole("admin_teacher"), courseSchemaValidate, createCourseController);

router.get("/courses",verifyToken ,hasRole("admin_teacher"),getAllCoursesController);

router.post("/:courseId/teacher/:teacherId",verifyToken,hasRole("admin_teacher") ,assignTeacherToCourseController);

router.delete("/:courseId",verifyToken,hasRole("admin_teacher"), removeTeacherFromCourseController);

export default router;
