import dotenv from "dotenv";

// Load environment variables BEFORE any other imports
dotenv.config();

import express from "express";
import cors from "cors";
import studyRoutes from "./routes/study.js";
import { errorHandler } from "./middleware/errorHandler.js";

// ─── Environment Verification ─────────────────────────────────────────────────────
console.log(`[Config] ✓ Loaded backend/.env`);
if (process.env.OPENROUTER_API_KEY) {
  console.log(`[Config] ✓ OpenRouter API key detected (${process.env.OPENROUTER_API_KEY.substring(0, 10)}...)`);
} else {
  console.error(`[Config] ✗ OPENROUTER_API_KEY not set in .env file`);
}
console.log(`[Config] ✓ OpenRouter model: ${process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini (default)'}`);
console.log(`[Config] ✓ Port: ${process.env.PORT || 5000}`);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS — allow all localhost Vite dev ports and any future origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
  "http://127.0.0.1:5177",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" is not allowed`));
      }
    },
    credentials: true,
  })
);

// Raise body limit to 50MB to accommodate large document text
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api", studyRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Global error handler (MUST come before 404 fallback)
app.use(errorHandler);

// Fallback for page not found (MUST come after error handler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "The requested API endpoint was not found.",
      status: 404,
    },
  });
});

const server = app.listen(PORT, () => {
  console.log(`[Server] Study Assistant backend is running on http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server] ERROR: Port ${PORT} is already in use.`);
    console.error(`[Server] Please stop the other process using port ${PORT} or change the PORT in .env`);
    process.exit(1);
  } else {
    console.error(`[Server] ERROR: Failed to start server: ${err.message}`);
    process.exit(1);
  }
});
