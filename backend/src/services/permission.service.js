import { permissionRepository } from "../repositories/permission.repository.js";


export const permissionService = {
  async listAvailablePermissions(roleName = null) {
    return permissionRepository.listAll(roleName);
  }
};