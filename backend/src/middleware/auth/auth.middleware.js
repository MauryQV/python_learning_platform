import jwt from "jsonwebtoken";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos la información del usuario autenticado
    req.userId = decoded.id;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role, 
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token expirado"
          : "Token inválido",
    });
  }
};

// Middleware para verificar que sea administrador
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "No tienes permisos de administrador.",
    });
  }
  next();
};
