import Groq from "groq-sdk";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// ─── Client Initialisation ────────────────────────────────────────────────────

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.warn(
    "[groqService] WARNING: GROQ_API_KEY is not set. All AI calls will fail."
  );
}

const groq = apiKey ? new Groq({ apiKey }) : null;

// ─── Model Config ─────────────────────────────────────────────────────────────

const MODEL = "llama-3.3-70b-versatile";
const TEMPERATURE = 0.1; // Low → more deterministic, better schema adherence

// ─── SYSTEM PROMPT (applied to EVERY Groq call) ───────────────────────────────
//
// This is the single source of truth for JSON-only enforcement.
// Never soften these rules. Every prompt appended by the user message
// MUST reinforce the same contract.
//
const STRICT_JSON_SYSTEM_PROMPT = `\
You are a professional educational AI that outputs ONLY raw JSON.

ABSOLUTE RULES — violating any of these will cause system failure:
1. Return ONLY a valid JSON object. No text before or after it.
2. NEVER wrap the response in markdown code fences (\`\`\`json ... \`\`\`).
3. NEVER use markdown syntax (asterisks, hashes, underscores) inside any string value.
4. NEVER add explanations, apologies, comments, or prose outside the JSON object.
5. NEVER include JavaScript-style comments (// or /* */) inside the JSON.
6. Every key and string value must use double quotes. No trailing commas.
7. If you are uncertain or cannot fulfil the request, return exactly:
   {"error": "brief reason why the request could not be fulfilled"}
8. The response MUST conform to the schema described in the user message.
   Any field that deviates from the schema type, cardinality, or format is INVALID.`.trim();

// ─── Zod Schema ───────────────────────────────────────────────────────────────

export const StudyPlanZodSchema = z.object({
  title: z
    .string()
    .min(1, "title cannot be empty")
    .max(120, "title too long"),
  summary: z
    .string()
    .min(50, "summary too short — must be at least 50 characters"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  estimatedStudyTime: z
    .string()
    .min(1, "estimatedStudyTime cannot be empty"),
  keyConcepts: z
    .array(
      z.object({
        concept: z.string().min(1),
        explanation: z.string().min(10),
      })
    )
    .min(4, "Minimum 4 key concepts required"),
  flashcards: z
    .array(
      z.object({
        front: z.string().min(1),
        back: z.string().min(1),
      })
    )
    .min(6, "Minimum 6 flashcards required"),
  quiz: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z
          .array(z.string().min(1))
          .length(4, "Each quiz question must have exactly 4 options"),
        answerIndex: z
          .number()
          .int()
          .min(0)
          .max(3, "answerIndex must be 0-3"),
        explanation: z.string().min(5),
      })
    )
    .min(5, "Minimum 5 quiz questions required"),
  roadmap: z
    .array(
      z.object({
        phase: z.string().min(1),
        tasks: z
          .array(
            z.object({
              id: z.string().min(1),
              task: z.string().min(1),
              description: z.string().default(""),
            })
          )
          .min(2, "Each roadmap phase needs at least 2 tasks"),
      })
    )
    .min(3, "Minimum 3 roadmap phases required"),
  revisionTips: z
    .array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(5),
      })
    )
    .min(4, "Minimum 4 revision tips required"),
  mnemonics: z
    .array(
      z.object({
        concept: z.string().min(1),
        phrase: z.string().min(1),
      })
    )
    .min(2, "Minimum 2 mnemonics required"),
});

export type StudyPlan = z.infer<typeof StudyPlanZodSchema>;

export interface GroqResponseMetadata {
  rawJson: string;
  model: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface GenerateStudyPlanResult {
  studyPlan: StudyPlan;
  metadata: GroqResponseMetadata;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strip markdown code fences the model may accidentally include.
 * Handles ```json...``` and plain ```...``` wrappers.
 *
 * This is a DEFENSIVE measure — the system prompt should prevent this,
 * but we never trust raw model output.
 */
function sanitizeGroqResponse(raw: string): string {
  let text = raw.trim();

  // Remove ```json ... ``` or ``` ... ``` wrappers
  const codeFenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
  const match = text.match(codeFenceRegex);
  if (match) {
    text = match[1].trim();
  }

  // Remove any leading/trailing non-JSON prose before the first {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  return text;
}

/**
 * Safely parse JSON with a descriptive error on failure.
 */
function parseJSON(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    console.error("[groqService] JSON.parse failed. Raw output (first 500 chars):", raw.slice(0, 500));
    throw new Error(
      "The AI model returned a response that could not be parsed as JSON. " +
        "This usually means the model emitted markdown or prose. " +
        "Please try again."
    );
  }
}

// ─── Main Generation Function ─────────────────────────────────────────────────

export async function generateStudyPlan(
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard"
): Promise<GenerateStudyPlanResult> {
  if (!groq) {
    throw new Error(
      "GROQ_API_KEY is not configured on the server. Please add it to backend/.env."
    );
  }

  // ── User Message ────────────────────────────────────────────────────────────
  //
  // Repeats the JSON-only contract and provides the exact schema.
  // Concrete examples in the schema comment prevent hallucinated field names.
  //
  const userMessage = `\
TASK: Analyse the study material below and return a SINGLE valid JSON object.

CRITICAL OUTPUT RULES:
- Return ONLY the JSON object. Nothing before it. Nothing after it.
- Do NOT use markdown, code fences, or asterisks inside string values.
- Do NOT add comments (// or /* */) anywhere in the JSON.
- If you cannot generate content, return: {"error": "brief reason"}
- The JSON MUST match the schema below EXACTLY — same field names, same types.

DIFFICULTY LEVEL: ${difficulty}

STUDY MATERIAL:
"""
${topic.slice(0, 48000)}
"""

REQUIRED JSON SCHEMA (return an object with all these fields):
{
  "title": "string — short engaging title for this study session (max 120 chars)",
  "summary": "string — comprehensive summary of the material (200-400 words, plain text only)",
  "difficulty": "${difficulty}",
  "estimatedStudyTime": "string — e.g. '2.5 hours'",
  "keyConcepts": [
    {
      "concept": "string — concept name",
      "explanation": "string — clear plain-text explanation (min 10 chars)"
    }
  ],
  "flashcards": [
    {
      "front": "string — question, term, or prompt",
      "back": "string — answer or definition"
    }
  ],
  "quiz": [
    {
      "question": "string — a multiple-choice question",
      "options": ["string", "string", "string", "string"],
      "answerIndex": 0,
      "explanation": "string — why this answer is correct (plain text)"
    }
  ],
  "roadmap": [
    {
      "phase": "string — e.g. 'Phase 1: Foundations'",
      "tasks": [
        {
          "id": "string — unique e.g. 'task-1-1'",
          "task": "string — task name",
          "description": "string — actionable detail (plain text)"
        }
      ]
    }
  ],
  "revisionTips": [
    {
      "id": "string — unique e.g. 'tip-1'",
      "text": "string — specific actionable advice (plain text)"
    }
  ],
  "mnemonics": [
    {
      "concept": "string — concept or process being memorised",
      "phrase": "string — the mnemonic phrase and what each letter/word stands for"
    }
  ]
}

QUANTITY REQUIREMENTS (all are MINIMUMS):
- keyConcepts: at least 4 items
- flashcards: at least 6 items
- quiz: exactly 5 items, each with exactly 4 options, answerIndex 0-3
- roadmap: at least 3 phases, each with at least 2 tasks
- revisionTips: at least 4 items
- mnemonics: at least 2 items

Now return the JSON object:`.trim();

  // ── API Call ─────────────────────────────────────────────────────────────────

  let rawContent: string;
  let completion: any;

  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: TEMPERATURE,
      response_format: { type: "json_object" }, // Forces JSON mode at API level
      messages: [
        {
          role: "system",
          content: STRICT_JSON_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    rawContent = completion.choices[0]?.message?.content ?? "";

    if (!rawContent.trim()) {
      throw new Error("Groq returned an empty response body.");
    }
  } catch (err: any) {
    // Re-throw Groq SDK / network errors with context
    console.error("[groqService] Groq API call failed:", err?.message ?? err);
    throw err;
  }

  // ── Sanitise & Parse ─────────────────────────────────────────────────────────

  const sanitised = sanitizeGroqResponse(rawContent);
  const parsed = parseJSON(sanitised) as Record<string, unknown>;

  // ── Detect model-reported error ───────────────────────────────────────────────

  if (typeof parsed.error === "string") {
    console.warn("[groqService] Model returned an error field:", parsed.error);
    throw new Error(`AI model could not generate a study plan: ${parsed.error}`);
  }

  // ── Zod Validation ────────────────────────────────────────────────────────────

  const result = StudyPlanZodSchema.safeParse(parsed);

  if (!result.success) {
    const formatted = result.error.format();
    console.error(
      "[groqService] Zod validation failed on Groq output:",
      JSON.stringify(formatted, null, 2)
    );
    throw new Error(
      "AI response did not conform to the study plan schema. " +
        "First issue: " +
        (result.error.errors[0]?.message ?? "unknown")
    );
  }

  // ── Build Metadata ────────────────────────────────────────────────────────────

  const metadata: GroqResponseMetadata = {
    rawJson: sanitised,
    model: MODEL,
    tokenUsage: completion.usage ? {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    } : undefined,
  };

  return {
    studyPlan: result.data,
    metadata,
  };
}
