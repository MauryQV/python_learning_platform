import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super_secret_key";

export const generateToken = async (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role:
        user.roles && user.roles.length > 0
          ? user.roles[0].role.name
          : user.role || "user",
    },
    SECRET,
    { expiresIn: "1h" }
  );
};

export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw new Error("expired Token");
    throw new Error("invalid Token");
  }
};
