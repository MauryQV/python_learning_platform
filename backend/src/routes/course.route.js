import express from "express";
import {
  createCourseController,
  getAllCoursesController,
  assignTeacherToCourseController,
  removeTeacherFromCourseController,
} from "../controllers/course.controller.js";
import { courseSchemaValidate } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create-course", courseSchemaValidate, createCourseController);

router.get("/courses", getAllCoursesController);

router.post("/:courseId/teacher/:teacherId", assignTeacherToCourseController);

router.delete("/:courseId", removeTeacherFromCourseController);

export default router;
