// Load environment variables FIRST
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./api/routers";
import { createContext } from "./api/context";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// tRPC handler
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => createContext({ req, res }),
  })
);

// In production, serve the Vite build
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] tRPC endpoint: http://localhost:${PORT}/api/trpc`);
  if (process.env.NODE_ENV === "production") {
    console.log(`[Server] Serving frontend from ${distPath}`);
  }
});

// Keep process alive
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
