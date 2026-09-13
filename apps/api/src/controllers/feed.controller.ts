import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { feedQuerySchema } from "../schemas/post.schema.js";

export async function getPersonalizedFeed(
  req: Request,
  res: Response,
) {
  try {
    const currentUser = res.locals.session?.user;

    const parsed = feedQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid pagination parameters",
        errors: parsed.error.flatten(),
      });
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    let authorIds: string[] | undefined = undefined;

    if (currentUser) {
      const following = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });

      const hasFollowing = following.length > 0;
      if (hasFollowing) {
        authorIds = [currentUser.id, ...following.map((f) => f.followingId)];
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: authorIds
          ? { authorId: { in: authorIds } }
          : {},
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          likes: currentUser
            ? { where: { userId: currentUser.id }, select: { id: true } }
            : false,
          bookmarks: currentUser
            ? { where: { userId: currentUser.id }, select: { id: true } }
            : false,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),

      prisma.post.count({
        where: authorIds
          ? { authorId: { in: authorIds } }
          : {},
      }),
    ]);

    const data = posts.map((p) => ({
      ...p,
      isLiked: currentUser ? (p as any).likes?.length > 0 : false,
      isBookmarked: currentUser ? (p as any).bookmarks?.length > 0 : false,
      likes: undefined,
      bookmarks: undefined,
    }));

    const totalPages = Math.ceil(total / limit);

    return res.json({
      status: "success",
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET PERSONALIZED FEED ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to fetch personalized feed",
    });
  }
}
