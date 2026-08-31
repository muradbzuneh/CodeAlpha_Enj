import cors from "cors";
import { getSession } from "./lib/session.js";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { requireAuth } from "./middleware/require.auth.js";

import { auth } from "./lib/auth.js";
import { prisma } from "./lib/prisma.js";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/api/me", async (req, res) => {
  try {
    const session = await getSession(req);

    if (!session) {
      return res.status(401).json({
        status: "error",
        message: "Not authenticated",
      });
    }

    return res.json({
      status: "ok",
      user: session.user,
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      },
    });
  } catch (error) {
    console.error("ME ROUTE ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to retrieve session",
    });
  }
});

app.get("/api/profile", requireAuth, (req, res) => {
  const session = res.locals.session;

  return res.json({
    status: "ok",
    message: "You are authenticated",
    user: session.user,
  });
});
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Enj API",
  });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});