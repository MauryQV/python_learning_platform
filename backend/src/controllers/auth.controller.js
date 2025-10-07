import authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
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

export const login = async (req, res, next) => {
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
