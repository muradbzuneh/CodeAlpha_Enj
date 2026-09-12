import { Router } from "express";
import {
  checkUsername,
  getFollowers,
  getFollowing,
  getProfile,
  getSuggestions,
  updateProfile,
} from "../controllers/profile.controller.js";
import { searchUsers, searchPostsByHashtag } from "../controllers/search.controller.js";
import { optionalAuth } from "../middleware/optional-auth.js";
import { requireAuth } from "../middleware/require-auth.js";
import { validateBody } from "../middleware/validate.js";
import { updateProfileSchema } from "../schemas/profile.schema.js";

export const profileRouter = Router();

profileRouter.get("/user/:userId", optionalAuth, getProfile);
profileRouter.get("/user/:userId/followers", optionalAuth, getFollowers);
profileRouter.get("/user/:userId/following", optionalAuth, getFollowing);

profileRouter.get("/suggestions", optionalAuth, getSuggestions);
profileRouter.get("/search/users", optionalAuth, searchUsers);
profileRouter.get("/search/hashtag", optionalAuth, searchPostsByHashtag);
profileRouter.get("/username/check", checkUsername);
profileRouter.patch("/profile", requireAuth, validateBody(updateProfileSchema), updateProfile);
