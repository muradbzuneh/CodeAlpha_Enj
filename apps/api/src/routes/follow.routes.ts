import { Router } from "express";
import {
  followUser,
  unfollowUser,
} from "../controllers/follow.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export const followRouter = Router();

followRouter.post(
  "/users/:userId/follow",
  requireAuth,
  followUser,
);

followRouter.delete(
  "/users/:userId/follow",
  requireAuth,
  unfollowUser,
);