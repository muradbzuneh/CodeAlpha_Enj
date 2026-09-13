import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function searchUsers(req: Request, res: Response) {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const skip = (page - 1) * limit;

    if (!q) {
      return res.json({ status: "success", data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }

    const currentUser = res.locals.session?.user;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          username: { contains: q, mode: "insensitive" },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          _count: { select: { followers: true } },
        },
      }),
      prisma.user.count({
        where: {
          username: { contains: q, mode: "insensitive" },
        },
      }),
    ]);

    let followingIds = new Set<string>();
    if (currentUser) {
      const following = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });
      followingIds = new Set(following.map((f) => f.followingId));
    }

    const data = users.map((u) => ({
      ...u,
      followerCount: u._count.followers,
      isFollowing: followingIds.has(u.id),
    }));

    return res.json({
      status: "success",
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("SEARCH USERS ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to search users",
    });
  }
}

export async function searchPostsByHashtag(req: Request, res: Response) {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const skip = (page - 1) * limit;

    if (!q) {
      return res.json({ status: "success", data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }

    const tag = q.startsWith("#") ? q.toLowerCase() : `#${q.toLowerCase()}`;

    const currentUser = res.locals.session?.user;

    const hashtagPosts = await prisma.postHashtag.findMany({
      where: { tag },
      select: { postId: true },
      skip,
      take: limit,
    });

    const postIds = hashtagPosts.map((h) => h.postId);

    if (postIds.length === 0) {
      return res.json({ status: "success", data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }

    const posts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        likes: currentUser ? { where: { userId: currentUser.id }, select: { id: true } } : false,
        _count: { select: { comments: true, likes: true } },
      },
    });

    const total = await prisma.postHashtag.count({ where: { tag } });

    const data = posts.map((p) => ({
      ...p,
      isLiked: currentUser ? (p as any).likes?.length > 0 : false,
      likes: undefined,
    }));

    return res.json({
      status: "success",
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("SEARCH HASHTAG ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to search by hashtag" });
  }
}
