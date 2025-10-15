import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super_secret_key";

class TokenService {
  generateToken(user) {
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
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") throw new Error("expired Token");
      throw new Error("invalid Token");
    }
  }
}

export default new TokenService();
