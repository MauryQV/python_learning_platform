// src/services/auth/auth.service.js
import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.repository.js";
import tokenService from "../auth/tokenService.js";
import { verifyGoogleToken } from "../auth/verifyGoogleToken.js";

export const register = async ({ firstName, lastName, email, password }) => {
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
    user: newUser,
  };
};

// Login clásico con email/password

export const login = async (email) => {
  // Ahora findByEmail ya incluye los roles automáticamente
  const user = await userRepository.findByEmailWithRoles(email);

  if (!user) {
    const error = new Error("Incorrect credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = tokenService.generateToken(user);
  // Extraer los roles del usuario
  const userRoles = user.roles.map((ur) => ur.role.name);
  const primaryRole = userRoles.includes("admin")
    ? "admin"
    : userRoles[0] || "user";

  const userData = {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: primaryRole,
    roles: userRoles,
    isVerified: user.isVerified,
    profileImage: user.profileImage,
  };

  return {
    token,
    user: userData,
  };
};

export const loginWithGoogle = async (idToken) => {
  const { email, googleId } = await verifyGoogleToken(idToken);

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("User not found. Please register first.");
  }
  // Validar que la cuenta está vinculada con Google
  if (!user.googleId || user.googleId !== googleId) {
    throw new Error(
      "This email is registered with a different method. Please use the correct login."
    );
  }

  const token = tokenService.generateToken(user);
  return { token, user };
};

export const registerWithGoogle = async (idToken) => {
  const { email, name, picture, googleId } = await verifyGoogleToken(idToken);

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new Error("User already registered with this email");
  }

  const user = await userRepository.createUserWithGoogle({
    email,
    googleId,
    name,
    picture,
  });

  const token = tokenService.generateToken(user);
  return { token, user };
};

// Verificar usuario
export const verifyUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return this._formatUserResponse(user);
};

export const updateUserRole = async (userId, newRole) => {
  const user = await userRepository.updateRole(userId, newRole);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
