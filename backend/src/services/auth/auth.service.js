// src/services/auth/auth.service.js
import bcrypt from "bcrypt";
import userRepository from "../../repositories/auth/user.repository.js";
import tokenService from "./token.service.js";

class AuthService {
  // Registro de usuario
  async register({ firstName, lastName, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error("The email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    // Traer roles por separado
    const userWithRoles = await userRepository.findById(newUser.userId);

    const token = tokenService.generateToken(userWithRoles);

    return {
      token,
      user: this._formatUserResponse(userWithRoles),
    };
  }

  // Login de usuario
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

    const token = tokenService.generateToken(user);

    return {
      token,
      user: this._formatUserResponse(user),
    };
  }

  // Verificar usuario
  async verifyUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return this._formatUserResponse(user);
  }

  // Actualizar rol del usuario
  async updateUserRole(userId, newRole) {
    const user = await userRepository.updateRole(userId, newRole);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return this._formatUserResponse(user);
  }

  // Formatear respuesta del usuario
  _formatUserResponse(user) {
    return {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.roles && user.roles.length > 0 ? user.roles[0].role.name : null,
      status: user.status,
      registeredAt: user.registeredAt,
    };
  }
}

export default new AuthService();

