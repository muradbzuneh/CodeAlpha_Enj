import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { feedQuerySchema } from "../schemas/post.schema.js";

export async function getLikedPosts(req: Request, res: Response) {
  try {
    const user = res.locals.session.user;

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

    // Order by when the user liked the post (newest likes first)
    // This is more natural for a "liked posts" collection than post creation time
    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
              _count: {
                select: { comments: true, likes: true },
              },
            },
          },
        },
      }),
      prisma.like.count({ where: { userId: user.id } }),
    ]);

    const posts = likes.map((like) => ({ ...like.post, isLiked: true }));
    const totalPages = Math.ceil(total / limit);

    return res.json({
      status: "success",
      data: posts,
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
    console.error("GET LIKED POSTS ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to fetch liked posts",
    });
  }
}
