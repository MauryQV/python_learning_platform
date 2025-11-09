import path from "path";
import fs from "fs/promises";
import prisma from "../../config/prismaClient.js";
import {
  findProfileById,
  updateProfile as updateProfileRepo,
} from "../repositories/user.repository.js";

const toDateOrNull = (v) => (v ? new Date(`${v}T00:00:00.000Z`) : null);
const clip = (s, n) => (typeof s === "string" ? s.slice(0, n) : s);

function getAuthUserId(req) {
  const candidates = [
    req.user?.userId,
    req.userId,
    req.user?.id,
    req.user?.sub,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (!Number.isNaN(n) && Number.isInteger(n)) return n;
  }
  return null;
}

export async function getMe(req, res, next) {
  try {
    const userId = getAuthUserId(req);
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user id in token" });

    const me = await findProfileById(userId);
    if (!me)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });

    return res.status(200).json(me);
  } catch (e) {
    next(e);
  }
}

export async function updateMe(req, res, next) {
  try {
    const userId = getAuthUserId(req);
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user id in token" });

    const { name, birthday, gender, profession, bio } = req.body;

    let firstName;
    let lastName;
    if (name) {
      const parts = String(name).trim().split(/\s+/);
      firstName = parts.shift() || "";
      lastName = parts.join(" ");
    }

    const updated = await updateProfileRepo(userId, {
      firstName,
      lastName,
      birthday: typeof birthday === "string" ? toDateOrNull(birthday) : null,
      gender: gender ?? null,
      profession: profession ?? null,
      bio: bio ? clip(bio, 150) : null,
    });

    return res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
}

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = getAuthUserId(req);
    if (!userId)
      return res.status(401).json({ message: "No authenticated user id" });

    const publicUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { userId },
      data: { profileImage: publicUrl },
      select: { userId: true, profileImage: true },
    });

    return res.json({ ok: true, url: publicUrl, user });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    return res.status(500).json({ ok: false, message: "Upload failed" });
  }
};

export const deleteAvatar = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId)
      return res.status(401).json({ message: "No authenticated user id" });

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { profileImage: true },
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const current = user.profileImage || "";

    if (current && /^\/uploads\//.test(current)) {
      try {
        const abs = path.join(process.cwd(), current.replace(/^\//, ""));
        await fs.unlink(abs);
      } catch (err) {
        console.warn("⚠️ Avatar delete warning:", err?.message);
      }
    }

    const updated = await prisma.user.update({
      where: { userId },
      data: { profileImage: null },
      select: {
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        bio: true,
        profileImage: true,
        role: true,
        goals: true,
        gender: true,
        birthday: true,
        profession: true,
      },
    });

    return res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
};

export const getProfileController = getMe;
