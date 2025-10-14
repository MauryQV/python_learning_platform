import bcrypt from "bcrypt";
import prisma from "../../../config/prismaClient.js";
import userRepository from "../../repositories/auth/user.repository.js";
import tokenService from "./token.service.js";
import * as tokenModule from "./token.service.js";

function signToken(payload) {
  if (typeof signJwtNamed === "function") return signJwtNamed(payload);
  if (typeof tokenService?.signJwt === "function") return tokenService.signJwt(payload);
  if (typeof tokenService?.generateToken === "function") return tokenService.generateToken(payload);
  throw new Error("No JWT signer available: expected signJwt or generateToken in token.service.js");
}

class AuthService {
  async register({ firstName, lastName, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error("The email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    const userWithRoles = await userRepository.findById(newUser.userId);

    const token = signToken({
      id: userWithRoles.userId,
      email: userWithRoles.email,
      role:
        userWithRoles.roles && userWithRoles.roles.length > 0
          ? userWithRoles.roles[0].role.name?.toLowerCase?.() ?? "user"
          : "user",
    });

    return {
      token,
      user: this._formatUserResponse(userWithRoles),
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("Incorrect credentials");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error = new Error("Incorrect credentials");
      error.statusCode = 401;
      throw error;
    }

    const role =
      user.roles && user.roles.length > 0
        ? user.roles[0].role.name?.toLowerCase?.() ?? "user"
        : "user";

    const token = signToken({
      id: user.userId, 
      email: user.email,
      role,
    });

    return {
      token,
      user: this._formatUserResponse(user),
    };
  }

  async verifyUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return this._formatUserResponse(user);
  }

  async updateUserRole(userId, newRole) {
    const user = await userRepository.updateRole(userId, newRole);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return this._formatUserResponse(user);
  }

  _formatUserResponse(user) {
    return {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role:
        user.roles && user.roles.length > 0 ? user.roles[0].role.name : null,
      status: user.status,
      registeredAt: user.registeredAt,
    };
  }
}

export default new AuthService();

export async function loginService(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: { include: { role: true } }, 
    },
  });

  if (!user) throw Object.assign(new Error("Credenciales inválidas"), { statusCode: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error("Credenciales inválidas"), { statusCode: 401 });

  const role = user.roles?.[0]?.role?.name?.toLowerCase?.() || "user";

  const token = signToken({
    id: user.userId,
    email: user.email,
    role,
  });

  return {
    token,
    user: {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role,
      status: user.status,
    },
  };
}
