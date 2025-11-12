import express from "express"
import { getAllStudentsController } from "../controllers/student.controller.js";
import { hasRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",getAllStudentsController);

export default router;