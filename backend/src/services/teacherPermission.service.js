// src/services/auth/teacherPermission.service.js
import {
  addPermission,
  removePermission,
  getUserPermissions,
  hasRole
} from "../repositories/userPermission.repository.js";
import { updateUserRoleRepository } from "../repositories/admin.repository.js";

/**
 * Asigna rol "teacher" (si aún no lo tiene) y permisos individuales.
 */
export const assignTeacherPermissions = async (teacherId, permissions = []) => {
  const validPermissions = ["teacher_editor", "teacher_executor"];
  const invalid = permissions.filter((p) => !validPermissions.includes(p));
  if (invalid.length > 0) {
    throw new Error(`Permisos inválidos: ${invalid.join(", ")}`);
  }

  // Si no tiene rol teacher → lo ascendemos
  const isTeacher = await hasRole(teacherId, "teacher");
  if (!isTeacher) {
    await updateUserRoleRepository(teacherId, "teacher");
  }

  // Asignar permisos (evita duplicados por upsert)
  const assigned = [];
  for (const permission of permissions) {
    const result = await addPermission(teacherId, permission);
    assigned.push(result.permission);
  }

  // Obtener permisos actuales del profesor
  const current = await getUserPermissions(teacherId);

  return {
    message: "Permissions asigned successfully",
    assigned,
    current: current.map((p) => p.permission)
  };
};

/**
 * Revoca permisos a un profesor.
 */
export const revokeTeacherPermissions = async (teacherId, permissions = []) => {
  const validPermissions = ["teacher_editor", "teacher_executor"];
  const invalid = permissions.filter((p) => !validPermissions.includes(p));
  if (invalid.length > 0) {
    throw new Error(`Invalid permissions: ${invalid.join(", ")}`);
  }

  // Validar que tenga rol teacher
  const isTeacher = await hasRole(teacherId, "teacher");
  if (!isTeacher) {
    throw new Error("The user does not have teacher role.");
  }

  const revoked = [];
  for (const permission of permissions) {
    try {
      await removePermission(teacherId, permission);
      revoked.push(permission);
    } catch (err) {
      // Ignorar si no tenía ese permiso
    }
  }

  const current = await getUserPermissions(teacherId);

  return {
    message: "Permissions revoked successfully",
    revoked,
    current: current.map((p) => p.permission)
  };
};



export const getTeacherPermissions = async (teacherId) => {
  const isTeacher = await hasRole(teacherId, "teacher");
  if (!isTeacher) {
    throw new Error("The user does not have teacher role.");
  }

  const permissions = await getUserPermissions(teacherId);
  return permissions.map((p) => p.permission);
};
