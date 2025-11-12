import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mimeToFormat = (mimetype) => {
  switch (mimetype) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return undefined;
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder =
      process.env.CLOUDINARY_UPLOAD_FOLDER || "learning-with-python/avatars";

    const userId = req?.user?.userId ?? req?.user?.id ?? "user";
    const ts = Date.now();

    const publicId = `${userId}-${ts}`;

    return {
      folder,
      public_id: publicId,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      format: mimeToFormat(file.mimetype),
      transformation: [{ width: 512, height: 512, crop: "limit" }],
    };
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  if (ok) return cb(null, true);
  cb(new Error("Invalid file type. Only JPG, PNG, WEBP allowed"));
};

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter,
}).single("avatar");
