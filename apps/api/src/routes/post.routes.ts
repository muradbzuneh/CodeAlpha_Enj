import { Router } from "express";

import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

import { requireAuth } from "../middleware/require.auth.js";
import { validateBody } from "../middleware/validate.js";

import {
  createPostSchema,
  updatePostSchema,
} from "../schemas/post.schema.js";

export const postRouter = Router();

postRouter.get("/", getPosts);

postRouter.get("/:id", getPostById);

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
