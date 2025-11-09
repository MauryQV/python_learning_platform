import {
  createCourse,
  getAllCourses,
  assignTeacherToCourse,
  removeTeacherFromCourse
} from "../repositories/course.repository.js"


export const createCourseService = async (name, description, startDate, endDate, code) => {
  const course = await createCourse(name, description, startDate, endDate, code);
  return {
    message: "Course created succesfully",
    course,
  };

}

export const getAllCoursesService = async () => {
  const courses = await getAllCourses();
  return {
    message: "All courses",
    courses

  }
}

export const assignTeacherToCourseService = async(courseId, teacherId) => {
  const course = await assignTeacherToCourse(courseId, teacherId);
  return {
    message: "Course assigned",
    course
  }
}

export const removeTeacherFromCourseService = async(courseId) => {
  const result = await removeTeacherFromCourse(courseId);
  return{
    message: "Teacher deleted",
    result
  }
}