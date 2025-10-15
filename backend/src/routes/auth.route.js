// src/routes/auth.routes.js
import express from "express";
import {
  validateRegister,
  validateLogin,
} from "../middleware/auth/validation.middleware.js";
import { registerController, loginController, loginWithGoogleController, registerWithGoogleController } from "../controllers/auth/auth.controller.js";

const router = express.Router();

router.post("/register", validateRegister, registerController);

router.post("/login", validateLogin, loginController);

router.post("/login/google",loginWithGoogleController);

router.post("/register/google",registerWithGoogleController);

export default router;
