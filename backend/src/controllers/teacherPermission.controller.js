// src/controllers/teacherPermission.controller.js
import {
  assignTeacherPermissions,
  revokeTeacherPermissions,
  getTeacherPermissions
} from "../services/teacherPermission.service.js";

export const assignPermissionController = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { permissions } = req.body;

    const result = await assignTeacherPermissions(Number(teacherId), permissions);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const revokePermissionController = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { permissions } = req.body;

    const result = await revokeTeacherPermissions(Number(teacherId), permissions);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTeacherPermissionsController = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const result = await getTeacherPermissions(Number(teacherId));

    res.status(200).json({
      message: "Actual permissions retrieved seccessfully",
      permissions: result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};