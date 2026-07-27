import { Request, Response, NextFunction } from "express";
import { generateStudyPlan } from "../services/geminiService.js";
import { z } from "zod";

// ─── Request Body Schema ──────────────────────────────────────────────────────

const GenerateRequestSchema = z.object({
  topic: z
    .string({ required_error: "topic is required" })
    .min(1, "topic cannot be empty")
    .max(5_000_000, "topic exceeds 5MB — please upload a smaller document"),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    required_error: "difficulty must be Easy, Medium, or Hard",
    invalid_type_error: "difficulty must be Easy, Medium, or Hard",
  }),
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  responseLength: z.enum(["short", "medium", "detailed"]).optional(),
  streamingEnabled: z.boolean().optional(),
  defaultOutputSections: z.object({
    summary: z.boolean().optional(),
    keyConcepts: z.boolean().optional(),
    flashcards: z.boolean().optional(),
    quiz: z.boolean().optional(),
    checklist: z.boolean().optional(),
    roadmap: z.boolean().optional(),
    importantTerms: z.boolean().optional(),
    tips: z.boolean().optional(),
  }).optional(),
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

  const { topic, difficulty, model, temperature, responseLength, streamingEnabled, defaultOutputSections } = bodyResult.data;

  try {
    const { studyPlan } = await generateStudyPlan(topic, difficulty, () => {}, {
      model,
      temperature,
      responseLength,
      streamingEnabled,
      defaultOutputSections,
    });

    const response = {
      success: true,
      data: studyPlan,
    };

    console.log("[studyController] ===== RESPONSE SENT TO FRONTEND =====");
    console.log(JSON.stringify(response, null, 2));

    res.status(200).json(response);
  } catch (error: any) {
    const message: string = error?.message ?? "An unexpected error occurred.";
    const status: number = error?.status ?? error?.statusCode ?? 500;

    console.error(`[studyController] Generation failed — ${message}`);

    // ── Rate limit or temporary unavailability ───────────────────────────────
    if (status === 429 || message.toLowerCase().includes("rate limit")) {
      res.status(503).json({
        success: false,
        error: {
          message: "AI service is temporarily unavailable. Please try again.",
          status: 503,
        },
      });
      return;
    }

    // ── Connection error ──────────────────────────────────────────────────────
    if (message.includes("ECONNREFUSED") || message.includes("Cannot connect")) {
      res.status(503).json({
        success: false,
        error: {
          message: "Cannot connect to AI service. Please check your internet connection and API key.",
          status: 503,
          code: "service_unavailable",
        },
      });
      return;
    }

    // ── Timeout ───────────────────────────────────────────────────────────────
    if (message.includes("timed out") || message.includes("timeout")) {
      res.status(504).json({
        success: false,
        error: {
          message: "AI generation timed out. Please try again with a shorter input.",
          status: 504,
          code: "timeout",
        },
      });
      return;
    }

    // ── JSON parse failure ────────────────────────────────────────────────────
    if (message.includes("not valid JSON") || message.includes("JSON.parse") || message.includes("parse")) {
      res.status(422).json({
        success: false,
        error: {
          message: "AI returned malformed data. Please try again.",
          detail: message,
          status: 422,
          code: "json_parse_failed",
        },
      });
      return;
    }

    // ── Schema validation failure ─────────────────────────────────────────────
    if (message.includes("schema mismatch") || message.includes("validation") || message.includes("structure")) {
      res.status(422).json({
        success: false,
        error: {
          message: "AI response format was incomplete. Please try again.",
          detail: message,
          status: 422,
          code: "schema_mismatch",
        },
      });
      return;
    }

    // ── All other errors → 500 via global handler ─────────────────────────────
    next(error);
  }
}
