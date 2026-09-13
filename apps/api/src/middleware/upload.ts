import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve("uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".bin";
    cb(null, `${uuid()}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = /^(image\/(jpeg|png|gif|webp|heic|heif)|video\/(mp4|webm|ogg|quicktime|x-msvideo|avi|mov|mkv|x-matroska))$/i;
  if (allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export function handleUploadError(err: any, _req: any, res: any, next: any) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ status: "error", message: "File too large. Maximum size is 20MB." });
    }
    return res.status(400).json({ status: "error", message: `Upload error: ${err.message}` });
  }
  if (err && err.message) {
    return res.status(400).json({ status: "error", message: err.message });
  }
  next(err);
}
