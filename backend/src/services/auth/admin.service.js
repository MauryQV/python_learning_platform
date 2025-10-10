// src/services/auth/admin.service.js
import { updateUserRoleRepository } from "../../repositories/admin/admin.repository.js";

/**
 * Actualiza o asigna un rol a un usuario.
 * @param {number} userId
 * @param {string} roleName
 * @returns {object} Usuario con rol formateado
 */
export const updateUserRoleService = async (userId, roleName) => {
  if (!roleName || typeof roleName !== "string") {
    throw new Error("El nombre del rol es obligatorio y debe ser un texto.");
  }

  // Llama al repository que ya devuelve el usuario con rol formateado
  const updatedUser = await updateUserRoleRepository(userId, roleName);

  return updatedUser;
};

