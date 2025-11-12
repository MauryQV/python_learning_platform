import { getAllTeachersService } from "../../src/services/teacher.service.js";
import { getAllTeachers } from "../../src/repositories/teacher.repository.js";

// Mocks
jest.mock("../../src/repositories/teacher.repository.js");

describe("Teacher Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // getAllTeachersService
  // -------------------------------------------------------------------------
  describe("getAllTeachersService", () => {
    it("debería retornar todos los profesores correctamente", async () => {
      const mockTeachers = [
        { id: 1, firstName: "Ana", lastName: "Pérez", email: "ana@mail.com" },
        { id: 2, firstName: "Luis", lastName: "Gómez", email: "luis@mail.com" },
      ];

      getAllTeachers.mockResolvedValue(mockTeachers);

      const result = await getAllTeachersService();

      expect(getAllTeachers).toHaveBeenCalled();
      expect(result).toEqual({ teachers: mockTeachers });
    });

    it("debería lanzar un error si getAllTeachers falla", async () => {
      getAllTeachers.mockRejectedValue(new Error("Database error"));

      await expect(getAllTeachersService()).rejects.toThrow("Database error");
    });
  });
});
