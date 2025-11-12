import {
  assignTeacherPermissions,
  revokeTeacherPermissions,
  getTeacherPermissions,
} from "../../src/services/teacherPermission.service.js";

import {
  addPermission,
  removePermission,
  getUserPermissions,
  hasRole,
} from "../../src/repositories/userPermission.repository.js";

import { updateUserRoleRepository } from "../../src/repositories/admin.repository.js";

// Mocks
jest.mock("../../src/repositories/userPermission.repository.js");
jest.mock("../../src/repositories/admin.repository.js");

describe("Teacher Permission Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // assignTeacherPermissions
  // -------------------------------------------------------------------------
  describe("assignTeacherPermissions", () => {
    it("debería lanzar error si existen permisos inválidos", async () => {
      await expect(
        assignTeacherPermissions(1, ["invalid_perm"])
      ).rejects.toThrow("Permisos inválidos: invalid_perm");
    });

    it("debería asignar permisos correctamente si el usuario no tiene rol teacher", async () => {
      hasRole.mockResolvedValue(false);
      updateUserRoleRepository.mockResolvedValue({ id: 1, role: "teacher" });
      addPermission
        .mockResolvedValueOnce({ permission: "teacher_editor" })
        .mockResolvedValueOnce({ permission: "teacher_executor" });
      getUserPermissions.mockResolvedValue([
        { permission: "teacher_editor" },
        { permission: "teacher_executor" },
      ]);

      const result = await assignTeacherPermissions(1, [
        "teacher_editor",
        "teacher_executor",
      ]);

      expect(hasRole).toHaveBeenCalledWith(1, "teacher");
      expect(updateUserRoleRepository).toHaveBeenCalledWith(1, "teacher");
      expect(addPermission).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        message: "Permissions asigned successfully",
        assigned: ["teacher_editor", "teacher_executor"],
        current: ["teacher_editor", "teacher_executor"],
      });
    });

    it("no debería actualizar el rol si ya es teacher", async () => {
      hasRole.mockResolvedValue(true);
      addPermission.mockResolvedValue({ permission: "teacher_editor" });
      getUserPermissions.mockResolvedValue([{ permission: "teacher_editor" }]);

      await assignTeacherPermissions(2, ["teacher_editor"]);

      expect(updateUserRoleRepository).not.toHaveBeenCalled();
      expect(addPermission).toHaveBeenCalledWith(2, "teacher_editor");
    });
  });

  // -------------------------------------------------------------------------
  // revokeTeacherPermissions
  // -------------------------------------------------------------------------
  describe("revokeTeacherPermissions", () => {
    it("debería lanzar error si los permisos son inválidos", async () => {
      await expect(
        revokeTeacherPermissions(1, ["bad_permission"])
      ).rejects.toThrow("Invalid permissions: bad_permission");
    });

    it("debería lanzar error si el usuario no tiene rol teacher", async () => {
      hasRole.mockResolvedValue(false);
      await expect(
        revokeTeacherPermissions(1, ["teacher_editor"])
      ).rejects.toThrow("The user does not have teacher role.");
    });

    it("debería revocar permisos correctamente", async () => {
      hasRole.mockResolvedValue(true);
      removePermission.mockResolvedValue(true);
      getUserPermissions.mockResolvedValue([{ permission: "teacher_executor" }]);

      const result = await revokeTeacherPermissions(1, ["teacher_editor"]);

      expect(removePermission).toHaveBeenCalledWith(1, "teacher_editor");
      expect(result).toEqual({
        message: "Permissions revoked successfully",
        revoked: ["teacher_editor"],
        current: ["teacher_executor"],
      });
    });

    it("debería manejar errores al revocar sin detener la ejecución", async () => {
      hasRole.mockResolvedValue(true);
      removePermission.mockRejectedValueOnce(new Error("DB error"));
      getUserPermissions.mockResolvedValue([]);

      const result = await revokeTeacherPermissions(1, ["teacher_editor"]);

      expect(removePermission).toHaveBeenCalled();
      expect(result).toEqual({
        message: "Permissions revoked successfully",
        revoked: [],
        current: [],
      });
    });
  });

  // -------------------------------------------------------------------------
  // getTeacherPermissions
  // -------------------------------------------------------------------------
  describe("getTeacherPermissions", () => {
    it("debería lanzar error si el usuario no tiene rol teacher", async () => {
      hasRole.mockResolvedValue(false);
      await expect(getTeacherPermissions(1)).rejects.toThrow(
        "The user does not have teacher role."
      );
    });

    it("debería retornar lista de permisos si tiene rol teacher", async () => {
      hasRole.mockResolvedValue(true);
      getUserPermissions.mockResolvedValue([
        { permission: "teacher_editor" },
        { permission: "teacher_executor" },
      ]);

      const result = await getTeacherPermissions(1);

      expect(hasRole).toHaveBeenCalledWith(1, "teacher");
      expect(result).toEqual(["teacher_editor", "teacher_executor"]);
    });
  });
});
