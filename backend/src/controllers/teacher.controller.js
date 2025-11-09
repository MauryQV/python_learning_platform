import { getAllTeachersService } from "../services/teacher.service.js";

export const getAllTeachersController = async (req, res, next) => {
  try {
    const teachers = await getAllTeachersService();
    res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};
