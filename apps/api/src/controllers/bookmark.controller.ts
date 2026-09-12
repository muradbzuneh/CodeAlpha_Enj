import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function toggleBookmark(req: Request, res: Response) {
  try {
    const user = res.locals.session.user;
    const postId = req.params.postId as string;
    const userId = user.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) {
      return res.status(404).json({ status: "error", message: "Post not found" });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ status: "success", data: { isBookmarked: false } });
    }

    await prisma.bookmark.create({ data: { userId, postId } });
    return res.json({ status: "success", data: { isBookmarked: true } });
  } catch (error) {
    console.error("TOGGLE BOOKMARK ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to toggle bookmark" });
  }
}

export async function checkBookmarks(req: Request, res: Response) {
  try {
    const user = res.locals.session.user;
    const postIds = Array.isArray(req.query.postIds) ? req.query.postIds as string[] : [];

    if (postIds.length === 0) {
      return res.json({ status: "success", data: {} });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id, postId: { in: postIds } },
      select: { postId: true },
    });

    const map: Record<string, boolean> = {};
    for (const b of bookmarks) map[b.postId] = true;

    return res.json({ status: "success", data: map });
  } catch (error) {
    console.error("CHECK BOOKMARKS ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to check bookmarks" });
  }
}

export async function getBookmarkedPosts(req: Request, res: Response) {
  try {
    const user = res.locals.session.user;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          post: {
            include: {
              author: { select: { id: true, name: true, username: true, image: true } },
              _count: { select: { comments: true, likes: true } },
              likes: { where: { userId: user.id }, select: { id: true } },
            },
          },
        },
      }),
      prisma.bookmark.count({ where: { userId: user.id } }),
    ]);

    const data = bookmarks.map((b) => ({
      ...b.post,
      isLiked: (b.post as any).likes?.length > 0,
      likes: undefined,
      isBookmarked: true,
    }));

    return res.json({
      status: "success",
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET BOOKMARKED POSTS ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to fetch bookmarks" });
  }
}
