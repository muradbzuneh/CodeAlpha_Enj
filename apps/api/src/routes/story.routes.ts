import { Router } from "express";
import {
  getStories,
  createStory,
  markStoryViewed,
  deleteStory,
} from "../controllers/story.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { optionalAuth } from "../middleware/optional-auth.js";

export const storyRouter = Router();

storyRouter.get("/stories", optionalAuth, getStories);
storyRouter.post("/stories", requireAuth, createStory);
storyRouter.post("/stories/:storyId/view", requireAuth, markStoryViewed);
storyRouter.delete("/stories/:storyId", requireAuth, deleteStory);
