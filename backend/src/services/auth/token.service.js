import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

class TokenService {
  generateToken(user) {
    return jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.roles && user.roles.length > 0 ? user.roles[0].role.name : null,
      },
      SECRET,
      { expiresIn: "1h" }
    );
  }

  verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
}

export default new TokenService();

