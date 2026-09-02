import { Router } from "express";

import {
  getPostLikes,
  likePost,
  unlikePost,
} from "../controllers/like.controller.js";

import { requireAuth } from "../middleware/require-auth.js";

export const likeRouter = Router();

likeRouter.get(
  "/posts/:postId/likes",
  getPostLikes,
);

likeRouter.post(
  "/posts/:postId/like",
  requireAuth,
  likePost,
);

likeRouter.delete(
  "/posts/:postId/like",
  requireAuth,
  unlikePost,
);