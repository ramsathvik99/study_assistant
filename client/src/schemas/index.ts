import { z } from "zod";

// ─── Auth Schemas ────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
});

// ─── Study Plan Schemas ───────────────────────────────────────────────────────

export const GenerateStudyPlanSchema = z.object({
  topic: z.string().min(1, "Please enter a topic or paste notes").max(50000, "Input too long"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

// ─── Study Goal Schemas ───────────────────────────────────────────────────────

export const StudyGoalSchema = z.object({
  topic: z.string().min(2, "Topic is required").max(100, "Topic too long"),
  targetDate: z.string().min(1, "Please select a target date"),
  dailyHours: z.number().min(0.5, "Minimum 0.5 hours").max(24, "Maximum 24 hours"),
  priority: z.enum(["Low", "Medium", "High"]),
  description: z.string().max(500, "Description too long").optional(),
});

// ─── Settings Schema ──────────────────────────────────────────────────────────

export const SettingsSchema = z.object({
  darkMode: z.boolean(),
  animationsEnabled: z.boolean(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanSchema>;
export type StudyGoalInput = z.infer<typeof StudyGoalSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;
