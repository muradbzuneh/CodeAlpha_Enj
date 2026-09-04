import { Router } from "express";
import { getPersonalizedFeed } from "../controllers/feed.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export const feedRouter = Router();

feedRouter.get(
  "/",
  requireAuth,
  getPersonalizedFeed,
);