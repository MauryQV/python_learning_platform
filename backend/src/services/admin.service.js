// src/services/auth/admin.service.js
import {updateUserRoleRepository,updateUserStatusRepository, findAllUsers} from "../repositories/admin.repository.js";
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

  const updatedUser = await updateUserRoleRepository(userId, roleName);
  return updatedUser;
};

/**
 * Actualiza el estado (active o blocked) de un usuario.
 * @param {number} userId
 * @param {string} status - "active" o "blocked"
 * @returns {object} Usuario actualizado
 */
export const updateUserStatusService = async (userId, status) => {
  if (!["active", "blocked"].includes(status)) {
    throw new Error("El estado debe ser 'active' o 'blocked'.");
  }

  const updatedUser = await updateUserStatusRepository(userId, status);
  return updatedUser;
};

 export const listAllUsersService = async () => {
    const users = await findAllUsers();
    return users;
  }