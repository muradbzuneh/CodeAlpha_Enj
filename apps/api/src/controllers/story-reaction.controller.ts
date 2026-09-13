import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createReaction(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;
    const storyId = req.params.storyId as string;
    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ status: "error", message: "Content is required" });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, authorId: true },
    });

    if (!story) {
      return res.status(404).json({ status: "error", message: "Story not found" });
    }

    const reaction = await prisma.storyReaction.create({
      data: {
        content: content.trim(),
        storyId,
        authorId: currentUser.id,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });

    return res.status(201).json({ status: "success", data: reaction });
  } catch (error) {
    console.error("CREATE STORY REACTION ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to create reaction" });
  }
}

export async function getReactions(req: Request, res: Response) {
  try {
    const storyId = req.params.storyId as string;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const skip = (page - 1) * limit;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true },
    });

    if (!story) {
      return res.status(404).json({ status: "error", message: "Story not found" });
    }

    const [reactions, total] = await Promise.all([
      prisma.storyReaction.findMany({
        where: { storyId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      }),
      prisma.storyReaction.count({ where: { storyId } }),
    ]);

    return res.json({
      status: "success",
      data: reactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET STORY REACTIONS ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to fetch reactions" });
  }
}

export async function deleteReaction(req: Request, res: Response) {
  try {
    const currentUser = res.locals.session.user;
    const reactionId = req.params.reactionId as string;

    const reaction = await prisma.storyReaction.findUnique({
      where: { id: reactionId },
      select: { id: true, authorId: true },
    });

    if (!reaction) {
      return res.status(404).json({ status: "error", message: "Reaction not found" });
    }

    if (reaction.authorId !== currentUser.id) {
      return res.status(403).json({ status: "error", message: "You can only delete your own reactions" });
    }

    await prisma.storyReaction.delete({ where: { id: reactionId } });

    return res.status(204).send();
  } catch (error) {
    console.error("DELETE STORY REACTION ERROR:", error);
    return res.status(500).json({ status: "error", message: "Unable to delete reaction" });
  }
}
