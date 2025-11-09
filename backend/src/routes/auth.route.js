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
  verifyEmailController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validateRegister, registerController);

router.post("/login", validateLogin, loginController);

router.post("/login/google", loginWithGoogleController);

router.post("/register/google", registerWithGoogleController);

router.get("/verify-email", verifyEmailController);

export default router;
