// src/routes/auth.routes.js
import express from "express";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation.middleware.js";
import {
  registerController,
  loginController,
  loginWithGoogleController,
  registerWithGoogleController,
} from "../controllers/auth.controller.js";

const router = express.Router();

//registrar usuarios
router.post("/register", validateRegister, registerController);

//loguear usuarios
router.post("/login", validateLogin, loginController);

//loguear usuarios con Google
router.post("/login/google", loginWithGoogleController);

//registrar usuarios con Google
router.post("/register/google", registerWithGoogleController);

export default router;
