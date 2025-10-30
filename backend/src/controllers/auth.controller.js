import * as authService from "../services/auth.service.js";
import { sendMail } from "../services/mail.service.js";


export const registerController = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.",
      ...data,
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const data = await authService.login(req.body.email, req.body.password);
    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      ...data,
    });
  } catch (err) {
    next(err);
  }
};

export const loginWithGoogleController = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "idToken is required",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login with Google successful",
    });
  } catch (error) {
    console.error("Login with Google error:", error);

    if (error.message.includes("User not found")) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    if (error.message.includes("registered with a different method")) {
      return res.status(400).json({
        success: false,
        message:
          "This email is registered with a different method. Please use the correct login.",
      });
    }

    if (/invalid/i.test(error.message)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

export const registerWithGoogleController = async (req, res) => {
  try {
    const { idToken: idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "idToken is required",
      });
    }

    const user = await authService.registerWithGoogle(idToken);

    return res
      .status(201)
      .json({ success: true, message: "Registration successful", user });
  } catch (error) {
    console.error("❌ Register with Google error:", error);

    if (error.message.includes("already registered")) {
      return res.status(409).json({
        success: false,
        message: "User already registered with this email",
      });
    }

    if (/invalid/i.test(error.message)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

export const verifyEmailController = async (req, res, next) => {
  try {
    const token = String(req.query.token || "");
    if (!token) {
      return res.status(400).json({ ok: false, error: "Missing ?token" });
    }

    const result = await authService.verifyEmailToken(token);
    if (!result?.ok) {
      return res.status(400).json(result);
    }

    return res.json({ ok: true, message: "Email verificado correctamente." });
  } catch (err) {
    next(err);
  }
};


