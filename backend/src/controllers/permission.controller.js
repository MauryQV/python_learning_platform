import { permissionService } from "../services/permission.service.js";

export const permissionController = async (req, res) => {
  try {
    const { role } = req.query; 
    const permissions = await permissionService.listAvailablePermissions(role);

    if (!permissions.length) {
      return res.status(404).json({
        message: role
          ? `Persmission not founf  '${role}'.`
          : "Permissions not found in the database"
      });
    }

    res.status(200).json({
      message: role
        ? `Permissions for role '${role}' obtained`
        : "Permissions obtained",
      data: permissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};