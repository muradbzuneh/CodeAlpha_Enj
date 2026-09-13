import type { Request, Response } from "express";

export async function uploadFile(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ status: "error", message: "No file provided" });
    }

    const type = file.mimetype.startsWith("video/") ? "video" : "image";
    const url = `/uploads/${file.filename}`;

    return res.json({ status: "success", data: { url, type, filename: file.filename } });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({ status: "error", message: "Upload failed" });
  }
}
