import nodemailer from "nodemailer";
import prisma from "../../config/prismaClient.js";
import { updateUserRoleService } from "../services/auth/admin.service.js";
import {
  generateRandomToken,
  hashToken,
  minutesFromNow,
} from "../services/auth/verificationToken.util.js";
import { sendVerificationEmail } from "../services/auth/mail.service.js";

const { VERIFY_TOKEN_TTL_MIN, FRONTEND_URL } = process.env;

function toIntId(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res
        .status(400)
        .json({ message: "Debes enviar el nuevo rol en el body." });
    }

    const updated = await updateUserRoleService(parseInt(id, 10), role);

    return res.status(200).json({
      message: "Rol del usuario actualizado exitosamente.",
      updated,
    });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    return res.status(500).json({
      message: error.message || "Error interno del servidor.",
    });
  }
};

export async function resendVerification(req, res, next) {
  try {
    const userId = toIntId(req.params.id);
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { userId }, 
      select: { userId: true, email: true, isVerified: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(409)
        .json({ success: false, message: "User is already verified" });
    }

    await prisma.emailVerificationToken.updateMany({
      where: {
        userId: user.userId,
        used: false,
        expiresAt: { gt: new Date() },
      },
      data: { used: true },
    });

    const plain = generateRandomToken(32);
    const tokenHash = hashToken(plain);
    const ttl = Number(VERIFY_TOKEN_TTL_MIN || 60);

    const record = await prisma.emailVerificationToken.create({
      data: {
        userId: user.userId,
        tokenHash,
        expiresAt: minutesFromNow(ttl),
      },
      select: { tokenId: true, expiresAt: true },
    });

    const base = FRONTEND_URL || "http://localhost:5173";
    const link = `${base}/verify-email?token=${plain}&uid=${user.userId}`;

    const info = await sendVerificationEmail({ to: user.email, link });
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

    return res.status(200).json({
      success: true,
      message: "Verification email re-sent",
      expiresAt: record.expiresAt,
      previewUrl,
    });
  } catch (err) {
    return next(err);
  }
}
