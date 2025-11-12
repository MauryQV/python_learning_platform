import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.repository.js";
import tokenService from "../auth/tokenService.js";
import { verifyGoogleToken } from "../auth/verifyGoogleToken.js";
import crypto from "crypto";
import { nanoid } from "nanoid";
import prisma from "../../config/prismaClient.js";
import { sendVerificationEmail } from "../services/mail.service.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const VERIFY_TTL_MIN = Number(process.env.VERIFY_TOKEN_TTL_MIN || 60);

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const minutesFromNow = (m = 60) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + m);
  return d;
};

async function createAndDispatchEmailVerification(user) {
  const rawToken = nanoid(64);
  const tokenHash = sha256(rawToken);

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.userId,
      tokenHash,
      expiresAt: minutesFromNow(VERIFY_TTL_MIN),
      used: false,
    },
  });

  const link = `${FRONTEND_URL}/verify-email?token=${encodeURIComponent(rawToken)}`;

  await sendVerificationEmail({
    to: user.email,
    link,
  });
}

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

  try {
    await createAndDispatchEmailVerification(newUser);
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }

  const token = tokenService.generateToken(newUser);

  return {
    token,
    user: newUser,
    needsVerification: true,
  };
};

export const login = async (email) => {
  const user = await userRepository.findByEmailWithRoles(email);

  if (!user) {
    const error = new Error("Incorrect credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = tokenService.generateToken(user);
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

export const verifyUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUserRole = async (userId, newRole) => {
  const user = await userRepository.updateRole(userId, newRole);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const verifyEmailToken = async (rawToken) => {
  if (!rawToken) return { ok: false, reason: "missing-token" };

  const tokenRow = await prisma.emailVerificationToken.findFirst({
    where: {
      tokenHash: sha256(rawToken),
      used: false,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!tokenRow) return { ok: false, reason: "invalid-or-expired" };

  await prisma.$transaction([
    prisma.user.update({
      where: { userId: tokenRow.userId },
      data: { isVerified: true, emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { tokenId: tokenRow.tokenId },
      data: { used: true },
    }),
  ]);

  return { ok: true };
};
