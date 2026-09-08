import type { NextFunction, Request, Response } from "express";
import { getSession } from "../lib/session.js";

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await getSession(req);
    if (session) {
      res.locals.session = session;
    }
  } catch {
    // Ignore — treat as unauthenticated
  }
  next();
}
