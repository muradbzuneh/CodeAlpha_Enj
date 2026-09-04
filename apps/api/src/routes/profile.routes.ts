import { Router } from "express";
import {
  checkUsername,
  getFollowers,
  getFollowing,
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { validateBody } from "../middleware/validate.js";
import { updateProfileSchema } from "../schemas/profile.schema.js";

export const profileRouter = Router();

profileRouter.get("/user/:userId", getProfile);
profileRouter.get("/user/:userId/followers", getFollowers);
profileRouter.get("/user/:userId/following", requireAuth, getFollowing);

profileRouter.get("/username/check", checkUsername);
profileRouter.patch("/profile", requireAuth, validateBody(updateProfileSchema), updateProfile);
