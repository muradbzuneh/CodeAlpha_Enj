import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { upload } from "../middleware/upload.js";

export const uploadRouter = Router();

uploadRouter.post("/upload", requireAuth, upload.single("file"), uploadFile);
