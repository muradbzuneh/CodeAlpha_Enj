import type { NextFunction, Request, Response } from "express";

import { getSession } from "../lib/session.js";

import { z } from "zod";

export const userIdSchema = z.object({
  userId: z.string().min(1, "User id is required"),
});

export const profileQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await getSession(req);

    if (!session) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    res.locals.session = session;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      status: "error",
      message: "Invalid or expired session",
    });
  }
}