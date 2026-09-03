import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User id is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,

        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to fetch profile",
    });
  }
}

export async function getFollowers(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User id is required",
      });
    }

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return res.json({
      status: "success",
      data: followers.map((item) => item.follower),
      count: followers.length,
    });
  } catch (error) {
    console.error("GET FOLLOWERS ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to fetch followers",
    });
  }
}

export async function getFollowing(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User id is required",
      });
    }

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return res.json({
      status: "success",
      data: following.map((item) => item.following),
      count: following.length,
    });
  } catch (error) {
    console.error("GET FOLLOWING ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to fetch following",
    });
  }
}