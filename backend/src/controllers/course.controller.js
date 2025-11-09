import {
  createCourseService,
  getAllCoursesService,
  assignTeacherToCourseService,
  removeTeacherFromCourseService,
} from "../services/course.service.js";

export const createCourseController = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, code } = req.body;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const result = await createCourseService(
      name,
      description,
      startDateObj,
      endDateObj,
      code
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  next();
};

export const getAllCoursesController = async (req, res, next) => {
  try {
    const courses = await getAllCoursesService();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const assignTeacherToCourseController = async (req, res, next) => {
  const courseId = parseInt(req.params.courseId);
  const teacherId = parseInt(req.params.teacherId);

  if (isNaN(courseId) || isNaN(teacherId)) {
    return res.status(400).json({
      success: false,
      message: "invalid IDs",
    });
  }
  try {
    const course = await assignTeacherToCourseService(courseId, teacherId);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

export const removeTeacherFromCourseController = async (req, res, next) => {
  const courseId = parseInt(req.params.courseId);
  try {
    const result = await removeTeacherFromCourseService(courseId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
