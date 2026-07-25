import { z } from "zod";

// ─── Study Plan Schemas ───────────────────────────────────────────────────────

export const GenerateStudyPlanSchema = z.object({
  topic:      z.string().min(1, "Please enter a topic or paste notes").max(50000, "Input too long"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

// ─── Settings Schema ──────────────────────────────────────────────────────────

export const SettingsSchema = z.object({
  darkMode:          z.boolean(),
  animationsEnabled: z.boolean(),
  developerMode:     z.boolean(),
});

export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanSchema>;
export type SettingsInput          = z.infer<typeof SettingsSchema>;
