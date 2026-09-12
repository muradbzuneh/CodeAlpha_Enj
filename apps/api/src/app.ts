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
import { storyRouter } from "./routes/story.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { storyReactionRouter } from "./routes/story-reaction.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { messageRouter } from "./routes/message.routes.js";
import { exploreRouter } from "./routes/explore.routes.js";
import { bookmarkRouter } from "./routes/bookmark.routes.js";
import path from "path";
export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));

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
app.use("/api", storyRouter);
app.use("/api", notificationRouter);
app.use("/api", storyReactionRouter);
app.use("/api", uploadRouter);
app.use("/api", messageRouter);
app.use("/api", exploreRouter);
app.use("/api", bookmarkRouter);

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
