import { Router } from "express";
import { getFollowers, getFollowing, getProfile } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export const profileRouter = Router();

profileRouter.get("/user/:userId", getProfile);
profileRouter.get("/user/:userId/followers", getFollowers);
profileRouter.get("/user/:userId/following", requireAuth, getFollowing);
