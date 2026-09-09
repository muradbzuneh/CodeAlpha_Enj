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

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: userId }, { username: userId }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        createdAt: true,
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const currentUser = res.locals.session?.user;
    let isFollowing = false;
    let isOwnProfile = false;

    if (currentUser) {
      isOwnProfile = currentUser.id === user.id;
      if (!isOwnProfile) {
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: user.id,
            },
          },
          select: { id: true },
        });
        isFollowing = !!follow;
      }
    }

    return res.json({ status: "success", data: { ...user, isFollowing, isOwnProfile } });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to fetch profile",
    });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;
    const { name, username, bio, image } = req.body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio || null;
    if (image !== undefined) updateData.image = image;

    if (username !== undefined) {
      const normalized = username.toLowerCase();

      if (normalized !== currentUser.username) {
        const existing = await prisma.user.findFirst({
          where: { username: normalized },
          select: { id: true },
        });

        if (existing) {
          return res.status(409).json({
            status: "error",
            message: "Username is already taken",
          });
        }
      }

      updateData.username = normalized;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No fields to update",
      });
    }

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        email: true,
        createdAt: true,
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });

    return res.json({ status: "success", data: updated });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return res.status(409).json({
        status: "error",
        message: "Username is already taken",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Unable to update profile",
    });
  }
}

export async function checkUsername(req: Request, res: Response) {
  try {
    const raw = req.query.username;
    const username = typeof raw === "string" ? raw.trim().toLowerCase() : "";

    if (username.length < 3 || username.length > 30) {
      return res.json({
        status: "success",
        data: { available: false, username },
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.json({
        status: "success",
        data: { available: false, username },
      });
    }

    const existing = await prisma.user.findFirst({
      where: { username },
      select: { id: true },
    });

    return res.json({
      status: "success",
      data: { available: !existing, username },
    });
  } catch (error) {
    console.error("CHECK USERNAME ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to check username",
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
      where: { followingId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const currentUser = res.locals.session?.user;
    let followingIds = new Set<string>();

    if (currentUser) {
      const following = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });
      followingIds = new Set(following.map((f) => f.followingId));
    }

    return res.json({
      status: "success",
      data: followers.map((item) => ({
        ...item.follower,
        isFollowing: followingIds.has(item.follower.id),
      })),
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
      where: { followerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const currentUser = res.locals.session?.user;
    let myFollowingIds = new Set<string>();

    if (currentUser) {
      const myFollowing = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });
      myFollowingIds = new Set(myFollowing.map((f) => f.followingId));
    }

    return res.json({
      status: "success",
      data: following.map((item) => ({
        ...item.following,
        isFollowing: myFollowingIds.has(item.following.id),
      })),
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

export async function getSuggestions(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session?.user;
    if (!currentUser) {
      return res.json({ status: "success", data: [], count: 0 });
    }

    const following = await prisma.follow.findMany({
      where: { followerId: currentUser.id },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id, notIn: followingIds },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });

    return res.json({ status: "success", data: users, count: users.length });
  } catch (error) {
    console.error("GET SUGGESTIONS ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to fetch suggestions",
    });
  }
}
