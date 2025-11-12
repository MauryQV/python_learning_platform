import {
  createCourseService,
  getAllCoursesService,
  assignTeacherToCourseService,
  removeTeacherFromCourseService,
} from "../../src/services/course.service.js";

import {
  createCourse,
  getAllCourses,
  assignTeacherToCourse,
  removeTeacherFromCourse,
} from "../../src/repositories/course.repository.js";

// Mocks
jest.mock("../../src/repositories/course.repository.js");

describe("Course Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------
  // createCourseService
  // -------------------------------------------------------------------
  describe("createCourseService", () => {
    it("debería crear un curso correctamente", async () => {
      const mockCourse = {
        id: 1,
        name: "Matemáticas",
        description: "Curso básico",
        startDate: "2025-01-01",
        endDate: "2025-06-01",
        code: "MATH101",
      };

      createCourse.mockResolvedValue(mockCourse);

      const result = await createCourseService(
        "Matemáticas",
        "Curso básico",
        "2025-01-01",
        "2025-06-01",
        "MATH101"
      );

      expect(createCourse).toHaveBeenCalledWith(
        "Matemáticas",
        "Curso básico",
        "2025-01-01",
        "2025-06-01",
        "MATH101"
      );

      expect(result).toEqual({
        message: "Course created succesfully",
        course: mockCourse,
      });
    });

    it("debería lanzar error si createCourse falla", async () => {
      createCourse.mockRejectedValue(new Error("DB error"));

      await expect(
        createCourseService("X", "desc", "2025-01-01", "2025-06-01", "CODE123")
      ).rejects.toThrow("DB error");
    });
  });

  // -------------------------------------------------------------------
  // getAllCoursesService
  // -------------------------------------------------------------------
  describe("getAllCoursesService", () => {
    it("debería retornar todos los cursos", async () => {
      const mockCourses = [
        { id: 1, name: "Matemáticas" },
        { id: 2, name: "Historia" },
      ];

      getAllCourses.mockResolvedValue(mockCourses);

      const result = await getAllCoursesService();

      expect(getAllCourses).toHaveBeenCalled();
      expect(result).toEqual({
        message: "All courses",
        courses: mockCourses,
      });
    });

    it("debería manejar error si getAllCourses falla", async () => {
      getAllCourses.mockRejectedValue(new Error("DB fail"));
      await expect(getAllCoursesService()).rejects.toThrow("DB fail");
    });
  });

  // -------------------------------------------------------------------
  // assignTeacherToCourseService
  // -------------------------------------------------------------------
  describe("assignTeacherToCourseService", () => {
    it("debería asignar un profesor correctamente", async () => {
      const mockCourse = {
        id: 1,
        name: "Matemáticas",
        teacherId: 5,
      };

      assignTeacherToCourse.mockResolvedValue(mockCourse);

      const result = await assignTeacherToCourseService(1, 5);

      expect(assignTeacherToCourse).toHaveBeenCalledWith(1, 5);
      expect(result).toEqual({
        message: "Course assigned",
        course: mockCourse,
      });
    });

    it("debería lanzar error si assignTeacherToCourse falla", async () => {
      assignTeacherToCourse.mockRejectedValue(new Error("Error al asignar"));
      await expect(assignTeacherToCourseService(1, 10)).rejects.toThrow(
        "Error al asignar"
      );
    });
  });

  // -------------------------------------------------------------------
  // removeTeacherFromCourseService
  // -------------------------------------------------------------------
  describe("removeTeacherFromCourseService", () => {
    it("debería eliminar el profesor del curso correctamente", async () => {
      const mockResult = { success: true };

      removeTeacherFromCourse.mockResolvedValue(mockResult);

      const result = await removeTeacherFromCourseService(1);

      expect(removeTeacherFromCourse).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: "Teacher deleted",
        result: mockResult,
      });
    });

    it("debería lanzar error si removeTeacherFromCourse falla", async () => {
      removeTeacherFromCourse.mockRejectedValue(new Error("Error DB"));
      await expect(removeTeacherFromCourseService(1)).rejects.toThrow(
        "Error DB"
      );
    });
  });
});
