import multer from "multer";
import fs from "fs";
import path from "path";

const AVATAR_DIR = path.join(process.cwd(), "uploads", "avatars");
fs.mkdirSync(AVATAR_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const userId = req?.user?.userId ?? req?.user?.id ?? "user";
    const uniqueName = `${userId}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(
      file.mimetype
    );
    if (ok) return cb(null, true);
    cb(new Error("Invalid file type. Only JPG, PNG, WEBP allowed"));
  },
});
