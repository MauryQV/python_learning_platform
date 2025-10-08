// src/routes/auth.routes.js
import express from "express";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation.middleware.js";
import { registerController, loginController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validateRegister, registerController);

router.post("/login", validateLogin, loginController);

export default router;
