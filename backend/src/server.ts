import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studyRoutes from "./routes/study.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
//
// Normalise a URL for comparison: lowercase, strip trailing slash.
const normalise = (url: string) => url.toLowerCase().replace(/\/+$/, "");

// Static origins that are always allowed
const STATIC_ORIGINS: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

// Production frontend URL injected via Render environment variable.
// Supports multiple comma-separated values, e.g.:
//   FRONTEND_URL=https://study-assistant-468n-murex.vercel.app,https://study-assistant.vercel.app
const envOrigins: string[] = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS: string[] = [
  ...STATIC_ORIGINS,
  ...envOrigins,
].map(normalise);

// Regex patterns for wildcard matches (Vercel preview deployments)
// Matches any subdomain of vercel.app, e.g. study-assistant-abc123-ramsathvik99.vercel.app
const ALLOWED_PATTERNS: RegExp[] = [
  /^https:\/\/study-assistant(-[a-z0-9]+)*(-murex|-ramsathvik99)?\.vercel\.app$/i,
  /^https:\/\/[a-z0-9-]+-ramsathvik99\.vercel\.app$/i,
  /^https:\/\/study-assistant-468n-murex\.vercel\.app$/i,
];

// Log at startup so Render logs confirm the value was read correctly
console.log("[CORS] Allowed static origins:", ALLOWED_ORIGINS);
console.log("[CORS] FRONTEND_URL env value:", process.env.FRONTEND_URL ?? "(not set)");

function isOriginAllowed(origin: string): boolean {
  const norm = normalise(origin);

  // Exact match in allow-list
  if (ALLOWED_ORIGINS.includes(norm)) return true;

  // Pattern match for Vercel preview deployments
  if (ALLOWED_PATTERNS.some((re) => re.test(origin))) return true;

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      // No origin = server-to-server / curl / Postman — always allow
      if (!origin) return callback(null, true);

      // Debug log — visible in Render logs to diagnose mismatches
      console.log(`[CORS] Incoming origin : "${origin}"`);
      console.log(`[CORS] Allowed origins : ${JSON.stringify(ALLOWED_ORIGINS)}`);

      if (isOriginAllowed(origin)) {
        console.log(`[CORS] ✓ Allowed: ${origin}`);
        return callback(null, true);
      }

      console.warn(`[CORS] ✗ Blocked: "${origin}" not in allow-list`);
      callback(new Error(`CORS: origin "${origin}" is not allowed`));
    },
    credentials: true,
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",   authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api",        studyRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date(),
    allowedOrigins: ALLOWED_ORIGINS,          // handy for debugging
  });
});

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { message: "The requested API endpoint was not found.", status: 404 },
  });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] NODE_ENV: ${process.env.NODE_ENV ?? "development"}`);
});
