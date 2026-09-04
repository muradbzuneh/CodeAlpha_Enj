import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getPersonalizedFeed(
  req: Request,
  res: Response,
) {
  try {
    const currentUser = res.locals.session.user;

    const page = Math.max(
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(String(req.query.limit ?? "10"), 10) || 10,
        1,
      ),
      50,
    );

    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUser.id,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map(
      (follow) => follow.followingId,
    );

    const authorIds = [
      currentUser.id,
      ...followingIds,
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
              image: true,
            },
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

    return res.json({
      status: "success",
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
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