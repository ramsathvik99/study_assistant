import { Request, Response, NextFunction } from "express";
import { generateStudyPlan } from "../services/groqService.js";
import { z } from "zod";

// ─── Request Body Schema ──────────────────────────────────────────────────────

const GenerateRequestSchema = z.object({
  topic: z
    .string({ required_error: "topic is required" })
    .min(1, "topic cannot be empty")
    .max(50000, "topic exceeds the 50,000-character limit"),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    required_error: "difficulty must be Easy, Medium, or Hard",
    invalid_type_error: "difficulty must be Easy, Medium, or Hard",
  }),
});

// ─── Controller ───────────────────────────────────────────────────────────────

export async function createStudyPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // 1. Validate incoming request body
  const bodyResult = GenerateRequestSchema.safeParse(req.body);
  if (!bodyResult.success) {
    res.status(400).json({
      success: false,
      error: {
        message: bodyResult.error.errors[0]?.message ?? "Invalid request body.",
        status: 400,
        details: bodyResult.error.format(),
      },
    });
    return;
  }

  const { topic, difficulty } = bodyResult.data;

  try {
    const { studyPlan, metadata } = await generateStudyPlan(topic, difficulty);

    res.status(200).json({
      success: true,
      data: studyPlan,
      debugMetadata: {
        responseTime: undefined, // Calculated on client side for accuracy
        model: metadata.model,
        tokenUsage: metadata.tokenUsage,
        validationStatus: "valid" as const,
      },
      rawJson: metadata.rawJson,
      model: metadata.model,
      tokenUsage: metadata.tokenUsage,
    });
  } catch (error: any) {
    const message: string = error?.message ?? "An unexpected error occurred.";
    const status: number = error?.status ?? error?.statusCode ?? 500;

    // ── Groq rate-limit ──────────────────────────────────────────────────────
    if (status === 429 || message.toLowerCase().includes("rate limit")) {
      res.status(429).json({
        success: false,
        error: {
          message: "AI rate limit reached. Please wait a moment and try again.",
          status: 429,
        },
      });
      return;
    }

    // ── Model returned {error} or schema mismatch ────────────────────────────
    if (
      message.includes("study plan schema") ||
      message.includes("AI model could not generate") ||
      message.includes("parsed as JSON")
    ) {
      res.status(422).json({
        success: false,
        error: {
          message,
          status: 422,
        },
      });
      return;
    }

    // ── API key not configured ───────────────────────────────────────────────
    if (message.includes("GROQ_API_KEY")) {
      res.status(503).json({
        success: false,
        error: {
          message: "AI service is not configured. Contact the administrator.",
          status: 503,
        },
      });
      return;
    }

    // ── All other errors → 500 via global handler ────────────────────────────
    next(error);
  }
}
