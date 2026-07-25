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

// Enable CORS for frontend Vite development server
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policy"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" })); // Increased limit for larger notes/input

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", studyRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Fallback for page not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "The requested API endpoint was not found.",
      status: 404,
    },
  });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Study Assistant backend is running on http://localhost:${PORT}`);
});
