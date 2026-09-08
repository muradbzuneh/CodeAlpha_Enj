import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { feedQuerySchema } from "../schemas/post.schema.js";

export async function getPersonalizedFeed(
  req: Request,
  res: Response,
) {
  try {
    const currentUser = res.locals.session.user;

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

    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUser.id,
      },
      select: {
        followingId: true,
      },
    });

    const authorIds = [
      currentUser.id,
      ...following.map((follow) => follow.followingId),
    ];

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: {
            in: authorIds,
          },
        },
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
          likes: {
            where: { userId: currentUser.id },
            select: { id: true },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),

      prisma.post.count({
        where: {
          authorId: {
            in: authorIds,
          },
        },
      }),
    ]);

    const data = posts.map((p) => ({
      ...p,
      isLiked: p.likes.length > 0,
      likes: undefined,
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
