import tokenService from "../auth/tokenService.js";

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

    const userId = decoded.userId ?? decoded.id ?? decoded.sub ?? null;
    const email = decoded.email ?? null;
    const role = decoded.role || "user";

    if (!userId && !email) {
      return res.status(401).json({
        success: false,
        message: "Token inválido: sin identificador de usuario.",
      });
    }

    req.userId = userId;
    req.user = {
      userId,
      id: userId,
      email,
      role,
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
    return res.status(401).json({
      success: false,
      message: "You dont have the required role.",
    });
  }
  next();
};
