import rateLimit from "express-rate-limit";

// Rate limit: 20 requests per hour per IP to protect the AI API usage
export const studyPlanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    error: {
      message: "Too many study plans generated from this IP. Please try again after an hour.",
      status: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
