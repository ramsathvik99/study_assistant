import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studyRoutes  from "./routes/study.js";
import authRoutes   from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT ?? 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
//
// Rules:
//  1. Localhost origins (development) are always allowed.
//  2. Any origin listed in FRONTEND_URL (comma-separated) is allowed.
//  3. Any *.vercel.app subdomain is allowed (covers Vercel preview deploys).
//  4. Requests with no Origin header (server-to-server, curl, Postman) are allowed.
//
// NEVER use app.use(cors()) without an origin check — that opens the API to
// every website on the internet.

/** Lowercase + strip trailing slash for safe comparison. */
const normalise = (url: string) => url.toLowerCase().replace(/\/+$/, "");

const STATIC_ORIGINS: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",  // vite preview
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

// Production frontend URL(s) from environment — supports comma-separated list.
// Example: FRONTEND_URL=https://study-assistant-468n-murex.vercel.app
const envOrigins: string[] = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Build the final static allow-list (normalised for comparison).
const ALLOWED_ORIGINS: string[] = [...STATIC_ORIGINS, ...envOrigins].map(normalise);

// Dynamic patterns — covers all *.vercel.app preview deployments.
const VERCEL_PATTERN = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

console.log("[CORS] Allowed static origins:", ALLOWED_ORIGINS);
console.log("[CORS] FRONTEND_URL env value:", process.env.FRONTEND_URL ?? "(not set)");

function isOriginAllowed(origin: string): boolean {
  const norm = normalise(origin);
  return ALLOWED_ORIGINS.includes(norm) || VERCEL_PATTERN.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header → server-to-server, curl, Postman → allow
      if (!origin) return callback(null, true);

      if (isOriginAllowed(origin)) {
        console.log(`[CORS] ✓ Allowed: ${origin}`);
        return callback(null, true);
      }

      console.warn(`[CORS] ✗ Blocked: "${origin}"`);
      callback(new Error(`CORS: origin "${origin}" is not allowed.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
    status:         "ok",
    timestamp:      new Date().toISOString(),
    env:            process.env.NODE_ENV ?? "development",
    allowedOrigins: ALLOWED_ORIGINS,
    groqConfigured: !!process.env.GROQ_API_KEY,
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
  if (!process.env.GROQ_API_KEY) {
    console.warn("[Server] WARNING: GROQ_API_KEY is not set — all AI calls will fail.");
  }
  if (!process.env.FRONTEND_URL) {
    console.warn("[Server] WARNING: FRONTEND_URL is not set — only localhost origins are allowed.");
  }
});
