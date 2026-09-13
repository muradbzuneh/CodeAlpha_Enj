import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listNotifications(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: currentUser.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          actor: {
            select: { id: true, name: true, username: true, image: true },
          },
          post: {
            select: { id: true, content: true },
          },
        },
      }),
      prisma.notification.count({ where: { userId: currentUser.id } }),
    ]);

    return res.json({
      status: "success",
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("LIST NOTIFICATIONS ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to fetch notifications",
    });
  }
}

export async function markRead(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;
    const notificationId = req.params.id as string;

    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId: currentUser.id },
    });

    if (!notification) {
      return res.status(404).json({ status: "error", message: "Notification not found" });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return res.json({ status: "success" });
  } catch (error) {
    console.error("MARK READ ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to mark notification as read" });
  }
}

export async function markAllRead(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;

    await prisma.notification.updateMany({
      where: { userId: currentUser.id, read: false },
      data: { read: true },
    });

    return res.json({ status: "success" });
  } catch (error) {
    console.error("MARK ALL READ ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to mark all as read" });
  }
}

export async function unreadCount(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;

    const count = await prisma.notification.count({
      where: { userId: currentUser.id, read: false },
    });

    return res.json({ status: "success", data: { count } });
  } catch (error) {
    console.error("UNREAD COUNT ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to fetch unread count" });
  }
}
