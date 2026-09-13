import { Router } from "express";
import { getPersonalizedFeed } from "../controllers/feed.controller.js";
import { optionalAuth } from "../middleware/optional-auth.js";

export const feedRouter = Router();

feedRouter.get(
  "/",
  optionalAuth,
  getPersonalizedFeed,
);