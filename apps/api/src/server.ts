import { app } from './app.ts';
import { createServer } from 'http';
import { auth } from './lib/auth.ts';
import { toNodeHandler } from 'better-auth/node';

const authHandler = toNodeHandler(auth);

const server = createServer(async (req, res) => {
  try {
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

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

server.listen(4001, () => {
  console.log("Server is running on port 4001");
});