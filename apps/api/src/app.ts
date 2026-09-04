import cors from "cors";
import { getSession } from "./lib/session.js";
import express from "express";
import { commentRouter } from "./routes/comment.routes.js";
import { likeRouter } from "./routes/like.routes.js";
import { postRouter } from "./routes/post.routes.js";
import { prisma } from "./lib/prisma.js";
import { profileRouter } from "./routes/profile.routes.js";
import { feedRouter } from "./routes/feed.routes.js";
import { followRouter } from "./routes/follow.routes.js";
export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

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
app.use("/api", commentRouter);
app.use("/api", followRouter);
app.use("/api", profileRouter);
app.use("/api/feed", feedRouter);
app.use("/api", likeRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Enj API",
  });
});

app.use("/api/posts", postRouter);

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
