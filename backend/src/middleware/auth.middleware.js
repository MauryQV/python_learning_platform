import tokenService from "../auth/tokenService.js";

/**
 * Middleware principal para verificar el token JWT.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token no proporcionado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = tokenService.verifyToken(token);

    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.message === "expired Token" ? "Token expirado" : "Token inválido",
    });
  }
};

/**
 * Middleware adicional para verificar si el usuario tiene rol admin.
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "No tienes permisos de administrador.",
    });
  }
  next();
};

export const hasRole = (roleName) => (req, res, next) => {
  if (!req.user || req.user.role !== roleName) {
    return res.status(403).json({
      success: false,
      message: `Requiere rol: ${roleName}`,
    });
  }
  next();
};
