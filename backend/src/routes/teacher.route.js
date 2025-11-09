import express from "express";
import { getAllTeachersController } from "../controllers/teacher.controller.js";
const router = express.Router();

router.get("/get-teachers", getAllTeachersController);

export default router;
