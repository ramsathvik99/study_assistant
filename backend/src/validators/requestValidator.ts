import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const generateSchema = z.object({
  topic: z
    .string({
      required_error: "Topic or notes content is required.",
    })
    .trim()
    .min(3, "Input must be at least 3 characters long.")
    .max(100000, "Input notes must not exceed 100,000 characters."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
});

export function validateGenerateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = generateSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          message: error.errors.map((e) => e.message).join(" "),
          status: 400,
        },
      });
      return;
    }
    next(error);
  }
}
