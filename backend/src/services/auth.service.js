// src/services/auth/auth.service.js
import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import tokenService from "../auth/tokenService.js";
import { verifyGoogleToken } from "../auth/verifyGoogleToken.js"


class AuthService {
  
async register({ firstName, lastName, email, password }) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error("The email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createWithDefaultRole({
    email,
    passwordHash,
    firstName,
    lastName,
  });

  const token = tokenService.generateToken(newUser);

  return {
    token,
    user: this._formatUserResponse(newUser),
  };
}


  // Login clásico con email/password
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

  
 async loginWithGoogle(idToken) {
  const { email, googleId } = await verifyGoogleToken(idToken);

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("User not found. Please register first.");
  }

  // Validar que la cuenta está vinculada con Google
  if (!user.googleId || user.googleId !== googleId) {
    throw new Error("This email is registered with a different method. Please use the correct login.");
  }

  const token = tokenService.generateToken(user);
  return { token, user };
}

async registerWithGoogle(idToken) {
  const { email, name, picture, googleId } = await verifyGoogleToken(idToken);

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new Error("User already registered with this email");
  }

  const user = await userRepository.createUserWithGoogle({ 
    email, 
    googleId,
    name, 
    picture 
  });

  const token = tokenService.generateToken(user);
  return { token, user };
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
      isVerified: user.isVerified,
    };
  }
}

export default new AuthService();
