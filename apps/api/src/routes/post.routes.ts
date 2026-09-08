import { Router } from "express";

import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { getLikedPosts } from "../controllers/liked-post.controller.js";
import { getTrendingPosts } from "../controllers/trending.controller.js";

import { requireAuth } from "../middleware/require-auth.js";
import { validateBody } from "../middleware/validate.js";

import { optionalAuth } from "../middleware/optional-auth.js";
import {
  createPostSchema,
  updatePostSchema,
} from "../schemas/post.schema.js";

export const postRouter = Router();

postRouter.get("/", optionalAuth, getPosts);

// Static routes MUST come before /:id to avoid param capture
postRouter.get("/liked", requireAuth, getLikedPosts);
postRouter.get("/trending", optionalAuth, getTrendingPosts);

postRouter.get("/:id", optionalAuth, getPostById);

postRouter.post(
  "/",
  requireAuth,
  validateBody(createPostSchema),
  createPost,
);

postRouter.patch(
  "/:id",
  requireAuth,
  validateBody(updatePostSchema),
  updatePost,
);

postRouter.delete(
  "/:id",
  requireAuth,
  deletePost,
);
