// src/services/auth.service.js
import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import tokenService from "./token.service.js";

class AuthService {
  async register({ firstName, lastName, email, password}) {
    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error("The email is already registered");
      error.statusCode = 409;
      throw error;
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    // Generar token
    const token = tokenService.generateToken(newUser);

    return {
      token,
      user: this._formatUserResponse(newUser),
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      const error = new Error("Incorrect credentials");
      error.statusCode = 401;
      throw error;
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error = new Error("Incorrect credentials");
      error.statusCode = 401;
      throw error;
    }

    // Generar token
    const token = tokenService.generateToken(user);

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

  _formatUserResponse(user) {
    return {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      registeredAt: user.registeredAt,
    };
  }
}

export default new AuthService();
