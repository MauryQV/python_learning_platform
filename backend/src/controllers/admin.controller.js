import { updateUserRoleService } from "../services/auth/admin.service.js";

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Debes enviar el nuevo rol en el body." });
    }

    const updated = await updateUserRoleService(parseInt(id), role);

    return res.status(200).json({
      message: "Rol del usuario actualizado exitosamente.",
      updated,
    });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    return res.status(500).json({
      message: error.message || "Error interno del servidor.",
    });
  }
};


