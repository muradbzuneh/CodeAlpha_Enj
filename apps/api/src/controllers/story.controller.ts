import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const STORY_TTL_HOURS = 24;

export async function getStories(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session?.user;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() - STORY_TTL_HOURS);

    const stories = await prisma.story.findMany({
      where: {
        createdAt: { gte: expiresAt },
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        views: currentUser
          ? { where: { userId: currentUser.id }, select: { id: true } }
          : false,
      },
    });

    const data = stories.map((s) => ({
      id: s.id,
      authorId: s.authorId,
      author: s.author,
      content: s.content,
      mediaUrl: s.mediaUrl,
      gradient: s.gradient,
      moodEmoji: s.moodEmoji,
      createdAt: s.createdAt.toISOString(),
      expiresAt: s.expiresAt.toISOString(),
      isViewed: currentUser ? (s as any).views.length > 0 : false,
    }));

    return res.json({ status: "success", data });
  } catch (error) {
    console.error("GET STORIES ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to fetch stories",
    });
  }
}

export async function createStory(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;
    const { textContent, mediaUrl, gradient, moodEmoji } = req.body;

    if (!textContent && !mediaUrl) {
      return res.status(400).json({
        status: "error",
        message: "Story must have text or media content",
      });
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + STORY_TTL_HOURS);

    const story = await prisma.story.create({
      data: {
        authorId: currentUser.id,
        content: textContent || null,
        mediaUrl: mediaUrl || null,
        gradient: gradient || "from-[#FF3366] via-[#FF5E7E] to-[#FFAA00]",
        moodEmoji: moodEmoji || null,
        expiresAt,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });

    return res.status(201).json({
      status: "success",
      data: {
        id: story.id,
        authorId: story.authorId,
        author: story.author,
        content: story.content,
        mediaUrl: story.mediaUrl,
        gradient: story.gradient,
        moodEmoji: story.moodEmoji,
        createdAt: story.createdAt.toISOString(),
        expiresAt: story.expiresAt.toISOString(),
        isViewed: false,
      },
    });
  } catch (error) {
    console.error("CREATE STORY ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to create story",
    });
  }
}

export async function markStoryViewed(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session?.user;
    const storyId = req.params.storyId as string;

    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true },
    });

    if (!story) {
      return res.status(404).json({
        status: "error",
        message: "Story not found",
      });
    }

    await prisma.storyView.upsert({
      where: {
        storyId_userId: { storyId, userId: currentUser.id },
      },
      create: { storyId, userId: currentUser.id },
      update: {},
    });

    return res.json({ status: "success" });
  } catch (error) {
    console.error("MARK STORY VIEWED ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to mark story as viewed",
    });
  }
}

export async function deleteStory(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;
    const storyId = req.params.storyId as string;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, authorId: true },
    });

    if (!story) {
      return res.status(404).json({
        status: "error",
        message: "Story not found",
      });
    }

    if (story.authorId !== currentUser.id) {
      return res.status(403).json({
        status: "error",
        message: "You can only delete your own stories",
      });
    }

    await prisma.story.delete({ where: { id: storyId } });

    return res.status(204).send();
  } catch (error) {
    console.error("DELETE STORY ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to delete story",
    });
  }
}
