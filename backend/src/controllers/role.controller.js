import * as roleService from "../services/role.service.js" 

export const getRolesController = async (req,res) => {

    try {
        const roles = await roleService.getRolesService()
        res.status(200).json(roles)

    }
    catch (error){
     res.status(500).json({message: error.message})
    }
}
