import { Router } from "express";

import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";

import { requireAuth } from "../middleware/require-auth.js";
import { validateBody } from "../middleware/validate.js";

import { createCommentSchema } from "../schemas/comment.schema.js";

export const commentRouter = Router();

commentRouter.get(
  "/posts/:postId/comments",
  getComments,
);

commentRouter.post(
  "/posts/:postId/comments",
  requireAuth,
  validateBody(createCommentSchema),
  createComment,
);

commentRouter.delete(
  "/comments/:id",
  requireAuth,
  deleteComment,
);