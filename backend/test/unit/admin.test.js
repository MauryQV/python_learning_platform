import {
  updateUserRoleService,
  updateUserStatusService,
  listAllUsersService,
} from "../../src/services/admin.service.js";

import {
  updateUserRoleRepository,
  updateUserStatusRepository,
  findAllUsers,
} from "../../src/repositories/admin.repository.js";

// Mockear todo el repositorio de admin
jest.mock("../../src/repositories/admin.repository.js");

describe("Admin Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateUserRoleService", () => {
    it("debería actualizar el rol de un usuario correctamente", async () => {
      const mockUser = { id: 1, email: "test@correo.com", role: "tutor" };
      updateUserRoleRepository.mockResolvedValue(mockUser);

      const result = await updateUserRoleService(1, "tutor");

      expect(updateUserRoleRepository).toHaveBeenCalledWith(1, "tutor");
      expect(result).toEqual(mockUser);
    });

    it("debería lanzar error si el rol no es un string válido", async () => {
      await expect(updateUserRoleService(1, 123)).rejects.toThrow(
        "El nombre del rol es obligatorio y debe ser un texto."
      );
    });

    it("debería lanzar error si el rol está vacío", async () => {
      await expect(updateUserRoleService(1, "")).rejects.toThrow(
        "El nombre del rol es obligatorio y debe ser un texto."
      );
    });
  });

  describe("updateUserStatusService", () => {
    it("debería actualizar el estado de un usuario correctamente", async () => {
      const mockUser = { id: 1, email: "test@correo.com", status: "active" };
      updateUserStatusRepository.mockResolvedValue(mockUser);

      const result = await updateUserStatusService(1, "active");

      expect(updateUserStatusRepository).toHaveBeenCalledWith(1, "active");
      expect(result).toEqual(mockUser);
    });

    it("debería lanzar error si el estado es inválido", async () => {
      await expect(updateUserStatusService(1, "pending")).rejects.toThrow(
        "El estado debe ser 'active' o 'blocked'."
      );
    });
  });

  // --------------------------------------
  // listAllUsersService
  // --------------------------------------
  describe("listAllUsersService", () => {
    it("debería retornar lista de usuarios", async () => {
      const mockUsers = [
        { id: 1, firstName: "Ana", email: "ana@mail.com", role: "tutor" },
      ];
      findAllUsers.mockResolvedValue(mockUsers);

      const result = await listAllUsersService();

      expect(findAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});
