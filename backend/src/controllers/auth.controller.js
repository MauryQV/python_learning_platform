import * as authService from "../services/auth.service.js";

export const registerController = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
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

    // Validar que idToken existe
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

    // Diferenciar tipos de errores
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

    if (
      error.message.includes("invalid") ||
      error.message.includes("Invalid")
    ) {
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
    // Asegúrate de que el frontend envíe { token: "..." }
    const { idToken: idToken } = req.body;

    // Validar que el token exista
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "idToken is required",
      });
    }

    const user = await authService.registerWithGoogle(idToken);

    // Si el servicio devuelve el usuario correctamente
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
