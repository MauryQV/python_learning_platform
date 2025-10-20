import {
  updateUserRoleService,
  updateUserStatusService,
  listAllUsersService,
} from "../services/admin.service.js";

export const updateUserRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res
        .status(400)
        .json({ message: "Debes enviar el nuevo rol en el body." });
    }

    const updated = await updateUserRoleService(parseInt(id, 10), role);

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

export const updateUserStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // valores esperados: "active" | "blocked"

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({
        message: "El estado debe ser 'active' o 'blocked'.",
      });
    }

    const updated = await updateUserStatusService(parseInt(id, 10), status);

    return res.status(200).json({
      message: `Estado del usuario actualizado a '${status}' exitosamente.`,
      updated,
    });
  } catch (error) {
    console.error("Error al actualizar el estado del usuario:", error);
    return res.status(500).json({
      message: error.message || "Error interno del servidor.",
    });
  }
};

export const findAllUsersController = async (req, res) => {
  try {
    const users = await listAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "not found" });
  }
};
