import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getSuggestedUsers(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session?.user;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 20);

    const following = currentUser
      ? await prisma.follow.findMany({
          where: { followerId: currentUser.id },
          select: { followingId: true },
        })
      : [];
    const followingIds = following.map((f) => f.followingId);
    const excludeIds = currentUser ? [currentUser.id, ...followingIds] : [];

    const users = await prisma.user.findMany({
      where: excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        _count: { select: { followers: true, posts: true } },
      },
    });

    return res.json({
      status: "success",
      data: users.map((u) => ({
        ...u,
        followerCount: u._count.followers,
        postCount: u._count.posts,
        isFollowing: false,
      })),
    });
  } catch (error) {
    console.error("GET SUGGESTED USERS ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to fetch suggested users" });
  }
}

export async function getPopularHashtags(req: Request, res: Response) {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);

    const posts = await prisma.post.findMany({
      select: { content: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const hashtagMap = new Map<string, number>();
    for (const post of posts) {
      const matches = post.content.match(/#[\w\u0590-\u05FF]+/g);
      if (matches) {
        for (const tag of matches) {
          const lower = tag.toLowerCase();
          hashtagMap.set(lower, (hashtagMap.get(lower) || 0) + 1);
        }
      }
    }

    const sorted = Array.from(hashtagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    return res.json({ status: "success", data: sorted });
  } catch (error) {
    console.error("GET POPULAR HASHTAGS ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to fetch hashtags" });
  }
}
