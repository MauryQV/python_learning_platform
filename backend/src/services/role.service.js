import * as roleRepository from "../repositories/role.repository.js"

export const getRolesService = async ()=> {
    const roles = await roleRepository.getRoles()
    return roles
}