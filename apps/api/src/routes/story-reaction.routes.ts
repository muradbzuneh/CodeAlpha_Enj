import { Router } from "express";
import {
  createReaction,
  getReactions,
  deleteReaction,
} from "../controllers/story-reaction.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export const storyReactionRouter = Router();

storyReactionRouter.get("/stories/:storyId/reactions", getReactions);
storyReactionRouter.post("/stories/:storyId/reactions", requireAuth, createReaction);
storyReactionRouter.delete("/stories/:storyId/reactions/:reactionId", requireAuth, deleteReaction);
