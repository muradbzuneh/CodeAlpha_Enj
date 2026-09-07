import { createServer } from "http";
import { app } from "./app.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const authHandler = toNodeHandler(auth);

const ALLOWED_ORIGIN = "http://localhost:3000";

function setCorsHeaders(res: import("http").ServerResponse, origin: string | undefined) {
  if (origin === ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
}

const server = createServer(async (req, res) => {
  try {
    const origin = req.headers.origin;

    // Handle CORS preflight for ALL routes (including /api/auth)
    if (req.method === "OPTIONS") {
      setCorsHeaders(res, origin);
      res.writeHead(204);
      res.end();
      return;
    }

    setCorsHeaders(res, origin);

    if (req.url?.startsWith("/api/auth")) {
      await authHandler(req, res);
    } else {
      app(req, res);
    }
  } catch (err) {
    console.error("Request handler error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "error", message: "Internal server error" }));
    }
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

server.listen(4001, () => {
  console.log("Server is running on port 4001");
});
