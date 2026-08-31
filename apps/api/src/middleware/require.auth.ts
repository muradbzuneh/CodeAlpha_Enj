import type { NextFunction, Request, Response } from "express";

import { getSession } from "../lib/session.js";

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