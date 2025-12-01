import express from "express";
import { getAllStudentsController } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", getAllStudentsController);

export default router;
