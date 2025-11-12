import path from "path";
import fs from "fs/promises";
import prisma from "../../config/prismaClient.js";
import { v2 as cloudinary } from "cloudinary"; 

import {
  findProfileById,
  updateProfile as updateProfileRepo,
} from "../repositories/user.repository.js";

const toDateOrNull = (v) => (v ? new Date(`${v}T00:00:00.000Z`) : null);
const clip = (s, n) => (typeof s === "string" ? s.slice(0, n) : s);


function getAuthUserId(req) {
  const candidates = [req.user?.userId, req.userId, req.user?.id, req.user?.sub];
  for (const c of candidates) {
    const n = Number(c);
    if (!Number.isNaN(n) && Number.isInteger(n)) return n;
  }
  return null;
}

function extractPublicIdFromUrl(url = "") {
  try {
    const u = new URL(url);
    const parts = decodeURIComponent(u.pathname).split("/"); 
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;
    const afterUpload = parts.slice(uploadIdx + 1); 
    const withoutVersion =
      afterUpload[0] && /^v\d+$/i.test(afterUpload[0])
        ? afterUpload.slice(1)
        : afterUpload;
    if (withoutVersion.length === 0) return null;
    const last = withoutVersion[withoutVersion.length - 1];
    const noExt =
      last.indexOf(".") >= 0 ? last.slice(0, last.lastIndexOf(".")) : last;
    const pathPart =
      withoutVersion.length > 1
        ? [...withoutVersion.slice(0, -1), noExt].join("/")
        : noExt;
    return pathPart || null; 
  } catch {
    return null;
  }
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

    const secureUrl = req.file.path;    
    const publicId  = req.file.filename;  

    if (!secureUrl)
      return res.status(400).json({ message: "Upload failed (no URL)" });

    let oldPublicId = null;
    try {
      const current = await prisma.user.findUnique({
        where: { userId },
        select: { profileImage: true, avatarPublicId: true }, 
      });
      oldPublicId = current?.avatarPublicId || extractPublicIdFromUrl(current?.profileImage);
    } catch {
    }

    if (oldPublicId && oldPublicId !== publicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (e) {
        console.warn("⚠️ Cloudinary destroy warning:", e?.message);
      }
    }

    let user;
    try {
      user = await prisma.user.update({
        where: { userId },
        data: { profileImage: secureUrl, avatarPublicId: publicId },
        select: { userId: true, profileImage: true },
      });
    } catch {
      user = await prisma.user.update({
        where: { userId },
        data: { profileImage: secureUrl },
        select: { userId: true, profileImage: true },
      });
    }

    return res.json({ ok: true, url: secureUrl, publicId, user });
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

    // Pull current values
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { profileImage: true, avatarPublicId: true }, 
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const currentUrl = user.profileImage || "";
    const cloudPublicId =
      user.avatarPublicId || extractPublicIdFromUrl(currentUrl);

    if (currentUrl && /^\/uploads\//.test(currentUrl)) {
      try {
        const abs = path.join(process.cwd(), currentUrl.replace(/^\//, ""));
        await fs.unlink(abs);
      } catch (err) {
        console.warn("⚠️ Local avatar delete warning:", err?.message);
      }
    }

    if (cloudPublicId) {
      try {
        await cloudinary.uploader.destroy(cloudPublicId);
      } catch (err) {
        console.warn("⚠️ Cloudinary delete warning:", err?.message);
      }
    }

    let updated;
    try {
      updated = await prisma.user.update({
        where: { userId },
        data: { profileImage: null, avatarPublicId: null },
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
    } catch {
      updated = await prisma.user.update({
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
    }

    return res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
};

export const getProfileController = getMe;
