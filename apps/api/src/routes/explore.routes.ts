import { Router } from "express";
import { getSuggestedUsers, getPopularHashtags } from "../controllers/explore.controller.js";
import { optionalAuth } from "../middleware/optional-auth.js";

export const exploreRouter = Router();

exploreRouter.get("/explore/suggested-users", optionalAuth, getSuggestedUsers);
exploreRouter.get("/explore/hashtags", optionalAuth, getPopularHashtags);
