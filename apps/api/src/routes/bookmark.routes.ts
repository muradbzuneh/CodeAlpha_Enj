import { Router } from "express";
import { toggleBookmark, checkBookmarks, getBookmarkedPosts } from "../controllers/bookmark.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export const bookmarkRouter = Router();

bookmarkRouter.post("/posts/:postId/bookmark", requireAuth, toggleBookmark);
bookmarkRouter.get("/bookmarks/check", requireAuth, checkBookmarks);
bookmarkRouter.get("/bookmarks", requireAuth, getBookmarkedPosts);
