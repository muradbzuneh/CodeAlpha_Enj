import { Router } from "express";
import {
  listNotifications,
  markRead,
  markAllRead,
  unreadCount,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

export const notificationRouter = Router();

notificationRouter.get("/notifications", requireAuth, listNotifications);
notificationRouter.get("/notifications/unread-count", requireAuth, unreadCount);
notificationRouter.patch("/notifications/:id/read", requireAuth, markRead);
notificationRouter.post("/notifications/read-all", requireAuth, markAllRead);
