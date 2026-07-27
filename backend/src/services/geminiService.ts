import dotenv from "dotenv";
import { z } from "zod";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

dotenv.config();

// ─── Configuration ────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 120 * 1000; // 120 seconds
const DEFAULT_TEMPERATURE = 0.3;
const MIN_CONTENT_LENGTH = 20;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressCallback = (event: ProgressEvent) => void;

export interface ProgressEvent {
  stage:   "extracting" | "chunking" | "summarizing" | "generating" | "finalizing" | "done" | "error";
  message: string;
  current?: number;
  total?:   number;
}

export interface GeminiResponseMetadata {
  rawJson:        string;
  model:          string;
  inputCharCount: number;
  chunksUsed:     number;
  generationTimeMs: number;
}

export interface GenerateStudyPlanResult {
  studyPlan: StudyPlan;
  metadata:  GeminiResponseMetadata;
}

export interface AISettings {
  model?: string;
  temperature?: number;
  responseLength?: "short" | "medium" | "detailed";
  streamingEnabled?: boolean;
  defaultOutputSections?: {
    summary?: boolean;
    keyConcepts?: boolean;
    flashcards?: boolean;
    quiz?: boolean;
    checklist?: boolean;
    roadmap?: boolean;
    importantTerms?: boolean;
    tips?: boolean;
  };
}

// ─── Zod Output Schema ────────────────────────────────────────────────────────

export const StudyPlanZodSchema = z.object({
  title:              z.string().min(1).max(200),
  summary:            z.string().min(100, "Summary must be comprehensive (minimum 100 characters)"),
  difficulty:         z.enum(["Easy", "Medium", "Hard"]),
  estimatedStudyTime: z.string().min(1),
  keyConcepts: z.array(
    z.object({ concept: z.string().min(1), explanation: z.string().min(1) })
  ).min(1),
  flashcards: z.array(
    z.object({ front: z.string().min(1), back: z.string().min(1) })
  ).min(1),
  quiz: z.array(z.object({
    question:    z.string().min(1),
    options:     z.array(z.string().min(1)).length(4),
    answerIndex: z.number().int().min(0).max(3),
    explanation: z.string().min(1),
  })).min(1),
  roadmap: z.array(z.object({
    phase: z.string().min(1),
    tasks: z.array(z.object({
      id:          z.string().min(1),
      task:        z.string().min(1),
      description: z.string().default(""),
    })).min(1),
  })).min(1),
  revisionTips: z.array(z.object({
    id:   z.string().min(1),
    text: z.string().min(1),
  })).min(1),
  mnemonics: z.array(z.object({
    concept: z.string().min(1),
    phrase:  z.string().min(1),
  })).min(1),
});

export type StudyPlan = z.infer<typeof StudyPlanZodSchema>;

// ─── Utilities ────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extracts JSON from text that might contain:
 * - Markdown code blocks (```json ... ```)
 * - Extra explanations
 * - Multiple JSON objects
 */
function extractJSON(text: string): string {
  console.log(`[Gemini] extractJSON - Input length: ${text.length} chars`);
  console.log(`[Gemini] extractJSON - First 500 chars:`, text.substring(0, 500));
  console.log(`[Gemini] extractJSON - Last 500 chars:`, text.substring(Math.max(0, text.length - 500)));

  // Try to find ```json blocks first
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    console.log(`[Gemini] extractJSON - Found markdown code block, extracted length: ${jsonBlockMatch[1].trim().length} chars`);
    return jsonBlockMatch[1].trim();
  }

  // Try to find raw JSON object at the start
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    console.log(`[Gemini] extractJSON - Found raw JSON object, extracting by brace matching`);
    // Find the matching closing brace
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") braceCount++;
        if (char === "}") braceCount--;

        if (braceCount === 0 && i > 0) {
          const extracted = trimmed.slice(0, i + 1);
          console.log(`[Gemini] extractJSON - Extracted JSON object, length: ${extracted.length} chars`);
          return extracted;
        }
      }
    }
  }

  console.log(`[Gemini] extractJSON - No JSON pattern found, returning trimmed text`);
  return trimmed;
}

/**
 * Cleans and parses JSON with comprehensive error recovery and logging
 */
function parseJSON(jsonStr: string): any {
  console.log(`[Gemini] parseJSON - Input length: ${jsonStr.length} chars`);
  console.log(`[Gemini] parseJSON - First 300 chars:`, jsonStr.substring(0, 300));
  console.log(`[Gemini] parseJSON - Last 300 chars:`, jsonStr.substring(Math.max(0, jsonStr.length - 300)));

  // Remove common issues
  let cleaned = jsonStr
    .replace(/,\s*}/g, "}") // trailing commas in objects
    .replace(/,\s*]/g, "]") // trailing commas in arrays
    .replace(/([^\\])'([^']*)'([^\\])/g, '$1"$2"$3') // single quotes to double
    .replace(/: undefined/g, ": null") // undefined to null
    .replace(/:\s*NaN/g, ": null") // NaN to null
    .replace(/:\s*Infinity/g, ": null"); // Infinity to null

  console.log(`[Gemini] parseJSON - Attempting to parse cleaned JSON`);

  try {
    const parsed = JSON.parse(cleaned);
    console.log(`[Gemini] parseJSON - Successfully parsed, keys:`, Object.keys(parsed));
    return parsed;
  } catch (err: any) {
    console.error(`[Gemini] parseJSON - Initial parse failed:`, err.message);
    console.error(`[Gemini] parseJSON - Cleaned JSON first 500 chars:`, cleaned.substring(0, 500));
    
    // Try fixing unescaped newlines
    console.log(`[Gemini] parseJSON - Attempting to fix unescaped newlines...`);
    let fixedNewlines = cleaned.replace(/([^\\])\n([^"])/g, '$1\\n$2');
    
    try {
      const parsed = JSON.parse(fixedNewlines);
      console.log(`[Gemini] parseJSON - Successfully parsed after newline fix, keys:`, Object.keys(parsed));
      return parsed;
    } catch (err2: any) {
      console.error(`[Gemini] parseJSON - Newline fix failed:`, err2.message);
    }
    
    // Try to recover by finding the last valid JSON structure
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace > 0) {
      const truncated = cleaned.slice(0, lastBrace + 1);
      console.log(`[Gemini] parseJSON - Attempting recovery with truncated JSON (length: ${truncated.length})`);
      try {
        const recovered = JSON.parse(truncated);
        console.log(`[Gemini] parseJSON - Recovery successful, keys:`, Object.keys(recovered));
        return recovered;
      } catch (recoveryErr: any) {
        console.error(`[Gemini] parseJSON - Recovery failed:`, recoveryErr.message);
      }
    }
    
    // Try to fix common JSON syntax errors
    console.log(`[Gemini] parseJSON - Attempting comprehensive syntax error fixes`);
    let fixed = cleaned
      .replace(/,\s*([}\]])/g, "$1") // remove trailing commas
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3') // quote unquoted property names
      .replace(/:\s*true\b/g, ': true') // ensure boolean formatting
      .replace(/:\s*false\b/g, ': false')
      .replace(/:\s*null\b/g, ': null');
    
    try {
      const parsedFixed = JSON.parse(fixed);
      console.log(`[Gemini] parseJSON - Syntax fix successful, keys:`, Object.keys(parsedFixed));
      return parsedFixed;
    } catch (fixErr: any) {
      console.error(`[Gemini] parseJSON - Syntax fix failed:`, fixErr.message);
    }
    
    console.error(`[Gemini] parseJSON - ALL recovery attempts failed`);
    throw new Error(`Failed to parse JSON after multiple recovery attempts. Last error: ${err.message}`);
  }
}

/**
 * Chunks text into manageable pieces
 */
function splitIntoChunks(text: string): string[] {
  const CHARS_PER_TOKEN = 3.8;
  const CHUNK_TARGET_TOKENS = 2500;
  const CHUNK_SIZE_CHARS = Math.floor(CHUNK_TARGET_TOKENS * CHARS_PER_TOKEN);

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > CHUNK_SIZE_CHARS) {
    let chunkEnd = CHUNK_SIZE_CHARS;

    // Find a good break point (newline or space)
    const lastNewline = remaining.lastIndexOf("\n", chunkEnd);
    const lastSpace = remaining.lastIndexOf(" ", chunkEnd);
    const breakPoint = Math.max(lastNewline, lastSpace);

    if (breakPoint > CHUNK_SIZE_CHARS * 0.7) {
      chunkEnd = breakPoint;
    }

    chunks.push(remaining.slice(0, chunkEnd).trim());
    remaining = remaining.slice(chunkEnd).trim();
  }

  if (remaining.length > 10) {
    chunks.push(remaining);
  }

  return chunks.filter(c => c.length > 10);
}

/**
 * Exponential backoff with jitter
 */
function getRetryDelay(attempt: number): number {
  const baseDelay = INITIAL_RETRY_DELAY_MS;
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
  return Math.floor(exponentialDelay + jitter);
}

/**
 * Check if error is transient (retryable)
 */
function isTransientError(error: any): boolean {
  const transientPatterns = [
    /timeout/i,
    /network/i,
    /econnreset/i,
    /etimedout/i,
    /service unavailable/i,
    /503/i,
    /502/i,
    /429/i,
  ];
  
  const errorMessage = error?.message || "";
  return transientPatterns.some(pattern => pattern.test(errorMessage));
}

// ─── Gemini Client ────────────────────────────────────────────────────────────

let geminiModel: GenerativeModel | null = null;

function getGeminiModel(): GenerativeModel {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  if (!geminiModel) {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log(`[Gemini] Initializing model: gemini-2.5-flash with JSON response format`);
    geminiModel = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: DEFAULT_TEMPERATURE,
        maxOutputTokens: 16384,
        responseMimeType: "application/json", // Force JSON output
      }
    });
  }

  return geminiModel;
}

async function callGemini(
  systemPrompt: string,
  userMessage: string,
  retryCount: number = 0
): Promise<string> {
  const startTime = Date.now();

  console.log(`[Gemini] ===== CALL GEMINI START (Attempt ${retryCount + 1}/${MAX_RETRIES}) =====`);
  console.log(`[Gemini] Model: ${GEMINI_MODEL}`);
  console.log(`[Gemini] Timeout: ${REQUEST_TIMEOUT_MS}ms`);
  console.log(`[Gemini] System prompt length: ${systemPrompt.length} chars`);
  console.log(`[Gemini] User message length: ${userMessage.length} chars`);

  const fullPrompt = `${systemPrompt}\n\n${userMessage}`;

  try {
    console.log(`[Gemini] Starting Gemini API call...`);
    const model = getGeminiModel();
    
    // Create a promise with timeout
    const apiPromise = model.generateContent(fullPrompt);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), REQUEST_TIMEOUT_MS);
    });

    const result = await Promise.race([apiPromise, timeoutPromise]);
    const elapsed = Date.now() - startTime;

    console.log(`[Gemini] Response received in ${elapsed}ms`);
    
    const response = result.response;
    const content = response.text();
    
    console.log(`[Gemini] Content length: ${content.length} chars`);
    
    if (!content || !content.trim()) {
      console.error(`[Gemini] Empty response from Gemini`);
      throw new Error("Empty response from Gemini");
    }

    console.log(`[Gemini] ===== CALL GEMINI SUCCESS =====`);
    return content;
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    console.error(`[Gemini] ===== CALL GEMINI ERROR =====`);
    console.error(`[Gemini] Full error object:`, err);
    console.error(`[Gemini] Error name:`, err?.name);
    console.error(`[Gemini] Error message:`, err?.message);
    console.error(`[Gemini] Error stack:`, err?.stack);
    console.error(`[Gemini] Elapsed time: ${elapsed}ms`);

    // Retry logic for transient errors
    if (retryCount < MAX_RETRIES - 1 && isTransientError(err)) {
      const delay = getRetryDelay(retryCount);
      console.log(`[Gemini] Transient error detected, retrying in ${delay}ms...`);
      await sleep(delay);
      return callGemini(systemPrompt, userMessage, retryCount + 1);
    }

    if (err.name === "AbortError" || err.message.includes("timeout")) {
      console.error(`[Gemini] Request timeout after ${elapsed}ms`);
      throw new Error(`Gemini request timed out after ${REQUEST_TIMEOUT_MS}ms`);
    }

    console.error(`[Gemini] Request failed: ${err.message}`);
    throw err;
  }
}

// ─── Prompt Templates ─────────────────────────────────────────────────────────

function generateSystemPrompt(): string {
  return `You are an expert educational content creator specializing in generating concise, well-structured study summaries.

Your task is to generate a complete study plan as a VALID JSON object. Focus on quality over quantity.

JSON SCHEMA (must return exactly this structure):
{
  "title": "Concise title (max 10 words)",
  "summary": "Concise but comprehensive study summary (500-1000 words)",
  "difficulty": "Easy|Medium|Hard",
  "estimatedStudyTime": "Time estimate",
  "keyConcepts": [{"concept": "Name", "explanation": "Details"}],
  "flashcards": [{"front": "Question", "back": "Answer"}],
  "quiz": [{"question": "Text", "options": ["A","B","C","D"], "answerIndex": 0, "explanation": "Why"}],
  "roadmap": [{"phase": "Name", "tasks": [{"id": "task-1", "task": "Name", "description": "Details"}]}],
  "revisionTips": [{"id": "tip-1", "text": "Tip"}],
  "mnemonics": [{"concept": "Name", "phrase": "Acronym"}]
}

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - absolutely no markdown, no code blocks, no explanations
2. Start with { and end with } - nothing before or after
3. All string values must be valid JSON (properly escaped newlines, quotes, etc.)
4. Every field is required and must be non-empty
5. Do not use \`\`\`json or any markdown
6. All answer indices must be 0-3

SUMMARY FIELD GUIDELINES (MOST IMPORTANT):
The summary should be concise but comprehensive - suitable for quick studying and revision.

STRUCTURE (use \\n to separate sections):
1. Introduction (2-3 sentences) - Overview and context
2. Definition - Clear, concise explanation of what it is
3. Core Concepts (5-10 points) - Each point explained in 1-3 sentences, no unnecessary detail
4. Working/Process (if applicable) - Step-by-step, maximum 5-7 steps
5. Advantages (4-6 points) - Key benefits concisely listed
6. Disadvantages (3-5 points) - Main challenges listed
7. Real-world Applications (5-8 examples) - Practical uses
8. Key Takeaways (5-10 points) - Revision points

SUMMARY CONTENT RULES:
- Target length: 500-1000 words (simple topics shorter, complex topics longer)
- Use bullet points and short paragraphs
- Avoid extremely long explanations
- Avoid repeating information
- Avoid huge lists or excessive details
- Write in simple, clear language
- Make it readable in 5-10 minutes and revise-able in 2-3 minutes
- Focus on most important concepts only
- Do NOT turn it into a textbook chapter
- NO excessive FAQs, NO huge interview Q&A sections
- NO overly detailed history unless essential`;
}

function generateUserPrompt(context: string, difficulty: string): string {
  return `Generate a concise but comprehensive study plan for the following material.

Difficulty: ${difficulty}

CRITICAL: Return ONLY a JSON object. No markdown. No code blocks. No text before or after.

SUMMARY GUIDELINES:
- Keep it focused and well-structured (500-1000 words)
- Use the structure: Introduction, Definition, Core Concepts, Process/Working, Advantages, Disadvantages, Applications, Key Takeaways
- Write concisely - each point should be clear but not overly detailed
- Avoid repetition and unnecessary information
- Use bullet points and short paragraphs
- Make it suitable for 5-10 minute reading and 2-3 minute revision
- Focus on the most important concepts only

Material:
${context}

Return only the JSON object. Start with { and end with }. No explanations.`;
}

// ─── Main Generation Function ────────────────────────────────────────────────

export async function generateStudyPlan(
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard",
  progress: ProgressCallback,
  aiSettings?: AISettings
): Promise<GenerateStudyPlanResult> {
  const overallStart = Date.now();
  
  // Use provided settings or defaults
  const temp = aiSettings?.temperature ?? DEFAULT_TEMPERATURE;
  const responseLength = aiSettings?.responseLength ?? "medium";
  const outputSections = aiSettings?.defaultOutputSections ?? {};
  const modelToUse = aiSettings?.model ?? GEMINI_MODEL;
  console.log(`[Gemini] generateStudyPlan called - topic length: ${topic.length}, difficulty: ${difficulty}`);

  try {
    // 1. Prepare context
    console.log(`[Gemini] Step 1: Preparing context...`);
    progress({ stage: "extracting", message: "Processing material..." });
    const inputCharCount = topic.length;
    const chunks = splitIntoChunks(topic);

    progress({ stage: "chunking", message: `Prepared ${chunks.length} chunk(s)` });
    console.log(`[Gemini] Input: ${inputCharCount} chars in ${chunks.length} chunk(s)`);

    // 2. Use first chunk (or join if small enough)
    console.log(`[Gemini] Step 2: Preparing context from chunks...`);
    const context = chunks.length === 1 ? chunks[0] : chunks.slice(0, 2).join("\n\n");
    console.log(`[Gemini] Context prepared - length: ${context.length} chars`);

    // 3. Make single Gemini request
    console.log(`[Gemini] Step 3: Starting AI generation...`);
    progress({ stage: "generating", message: "Generating study materials with AI..." });
    console.log(`[Gemini] Starting single request for all components...`);

    const systemPrompt = generateSystemPrompt();
    const userPrompt = generateUserPrompt(context, difficulty);
    console.log(`[Gemini] Prompts generated - system: ${systemPrompt.length} chars, user: ${userPrompt.length} chars`);

    console.log(`[Gemini] Calling callGemini...`);
    let rawResponse = await callGemini(systemPrompt, userPrompt);
    console.log(`[Gemini] callGemini returned - response length: ${rawResponse.length}`);
    console.log(`[Gemini] ===== RAW GEMINI RESPONSE START =====`);
    console.log(rawResponse);
    console.log(`[Gemini] ===== RAW GEMINI RESPONSE END =====`);

    // 4. Extract and parse JSON
    console.log(`[Gemini] Step 4: Extracting and parsing JSON...`);
    progress({ stage: "summarizing", message: "Parsing response..." });
    console.log(`[Gemini] Response length: ${rawResponse.length} chars`);

    // Since we use responseMimeType: "application/json", the response should be pure JSON
    // Try direct parse first, then fall back to extraction if needed
    let extractedJSON = rawResponse.trim();
    let parsed: any;
    
    try {
      parsed = JSON.parse(extractedJSON);
      console.log(`[Gemini] Direct JSON parse successful`);
    } catch (directErr: any) {
      console.log(`[Gemini] Direct parse failed: ${directErr.message}, trying extraction...`);
      extractedJSON = extractJSON(rawResponse);
      console.log(`[Gemini] JSON extracted - length: ${extractedJSON.length} chars`);
      parsed = parseJSON(extractedJSON);
    }
    
    console.log(`[Gemini] JSON parsed successfully`);
    console.log(`[Gemini] Response keys: ${Object.keys(parsed).join(", ")}`);

    // 5. Retry with stricter prompt if parsing fails
    let jsonParseRetries = 0;
    const MAX_JSON_RETRIES = 2;
    
    while ((!parsed || typeof parsed !== "object") && jsonParseRetries < MAX_JSON_RETRIES) {
      console.warn(`[Gemini] JSON parse attempt ${jsonParseRetries + 1} failed, retrying...`);
      jsonParseRetries++;
      progress({ stage: "generating", message: `Retrying JSON parsing (${jsonParseRetries}/${MAX_JSON_RETRIES})...` });

      const stricterPrompt = `${generateSystemPrompt()}\n\nCRITICAL: Return ONLY raw JSON. No markdown code blocks (\`\`\`). No explanations. Start with { and end with }.`;
      console.log(`[Gemini] Retry ${jsonParseRetries}/${MAX_JSON_RETRIES} with stricter prompt...`);
      rawResponse = await callGemini(stricterPrompt, userPrompt);
      console.log(`[Gemini] Retry response received - length: ${rawResponse.length}`);
      extractedJSON = extractJSON(rawResponse);
      parsed = parseJSON(extractedJSON);

      console.log(`[Gemini] Retry ${jsonParseRetries} parse ${parsed ? 'successful' : 'failed'}`);
    }
    
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Failed to parse JSON after multiple retries");
    }

    // 6. Self-healing: Add missing sections with default values
    console.log(`[Gemini] Step 5: Self-healing response...`);
    
    // Ensure summary is comprehensive if it's too short
    let summary = parsed.summary || "";
    if (typeof summary !== "string" || summary.length < 200) {
      console.warn(`[Gemini] Summary is too short (${summary.length} chars), will fail validation`);
      summary = summary || "Study Guide\n\nThis topic covers important concepts and principles.";
    }
    
    const healed = {
      title: parsed.title || "Study Plan",
      summary: summary,
      difficulty: parsed.difficulty || difficulty,
      estimatedStudyTime: parsed.estimatedStudyTime ||
        (difficulty === "Easy" ? "1-2 hours" :
         difficulty === "Medium" ? "2-4 hours" : "4-8 hours"),
      keyConcepts: Array.isArray(parsed.keyConcepts) ? parsed.keyConcepts : 
                   (Array.isArray(parsed.key_concepts) ? parsed.key_concepts : [
                     { concept: "Core Concept", explanation: "A fundamental principle of this topic" }
                   ]),
      flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards : [
        { front: "What is this topic?", back: "A subject of study" }
      ],
      quiz: Array.isArray(parsed.quiz) ? parsed.quiz : [
        { 
          question: "What is this topic?",
          options: ["A", "B", "C", "D"],
          answerIndex: 0,
          explanation: "This is correct"
        }
      ],
      roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap : [
        { phase: "Introduction", tasks: [
          { id: "task-1", task: "Learn Basics", description: "Understand fundamentals" }
        ]}
      ],
      revisionTips: Array.isArray(parsed.revisionTips) ? parsed.revisionTips :
                     (Array.isArray(parsed.revision_tips) ? parsed.revision_tips : [
                       { id: "tip-1", text: "Review regularly" }
                     ]),
      mnemonics: Array.isArray(parsed.mnemonics) ? parsed.mnemonics : [
        { concept: "Memory Aid", phrase: "A memorable way to remember" }
      ],
    };
    
    // Log missing fields
    const missingFields: string[] = [];
    if (!parsed.title) missingFields.push("title");
    if (!parsed.summary || parsed.summary.length < 200) missingFields.push("summary (too short)");
    if (!Array.isArray(parsed.keyConcepts) && !Array.isArray(parsed.key_concepts)) missingFields.push("keyConcepts");
    if (!Array.isArray(parsed.flashcards)) missingFields.push("flashcards");
    if (!Array.isArray(parsed.quiz)) missingFields.push("quiz");
    if (!Array.isArray(parsed.roadmap)) missingFields.push("roadmap");
    if (!Array.isArray(parsed.revisionTips) && !Array.isArray(parsed.revision_tips)) missingFields.push("revisionTips");
    if (!Array.isArray(parsed.mnemonics)) missingFields.push("mnemonics");
    
    if (missingFields.length > 0) {
      console.log(`[Gemini] Self-healing: Added defaults for missing fields: ${missingFields.join(", ")}`);
    }

    console.log(`[Gemini] Healed response:`, {
      title: Boolean(healed.title),
      summary: `${String(healed.summary).length} chars`,
      concepts: Array.isArray(healed.keyConcepts) ? healed.keyConcepts.length : 0,
      flashcards: Array.isArray(healed.flashcards) ? healed.flashcards.length : 0,
      quiz: Array.isArray(healed.quiz) ? healed.quiz.length : 0,
      roadmap: Array.isArray(healed.roadmap) ? healed.roadmap.length : 0,
      tips: Array.isArray(healed.revisionTips) ? healed.revisionTips.length : 0,
      mnemonics: Array.isArray(healed.mnemonics) ? healed.mnemonics.length : 0,
    });

    // 7. Validate with Zod
    console.log(`[Gemini] Step 6: Running Zod validation...`);
    progress({ stage: "finalizing", message: "Validating structure..." });
    console.log(`[Gemini] Running Zod validation...`);
    console.log(`[Gemini] Healed data:`, JSON.stringify(healed, null, 2));

    const validation = StudyPlanZodSchema.safeParse(healed);
    if (!validation.success) {
      console.error(`[Gemini] ===== VALIDATION FAILED =====`);
      console.error(`[Gemini] Validation errors:`, validation.error.errors);
      console.error(`[Gemini] Error details:`, JSON.stringify(validation.error.format(), null, 2));
      console.error(`[Gemini] Missing/invalid fields:`, validation.error.errors.map(e => `${e.path.join('.')} - ${e.message}`));
      
      // Try to fix common validation errors
      const fixed = { ...healed };
      let fixesApplied = 0;
      
      validation.error.errors.forEach(err => {
        const path = err.path.join('.');
        if (path === 'summary' && err.code === 'too_small') {
          fixed.summary = fixed.summary || 'Summary not provided.';
          fixesApplied++;
        }
      });
      
      if (fixesApplied > 0) {
        console.log(`[Gemini] Applied ${fixesApplied} validation fixes`);
        const retryValidation = StudyPlanZodSchema.safeParse(fixed);
        if (retryValidation.success) {
          console.log(`[Gemini] Validation successful after fixes`);
          return {
            studyPlan: retryValidation.data,
            metadata: {
              rawJson: JSON.stringify(fixed),
              model: GEMINI_MODEL,
              inputCharCount,
              chunksUsed: chunks.length,
              generationTimeMs: Date.now() - overallStart,
            },
          };
        }
      }
      
      throw new Error(`Schema validation failed: ${validation.error.errors[0]?.message}`);
    }

    const elapsedMs = Date.now() - overallStart;
    progress({ stage: "done", message: "Complete!" });
    console.log(`[Gemini] ✅ Study plan generated successfully in ${elapsedMs}ms`);
    console.log(`[Gemini] Total generation time: ${elapsedMs}ms`);

    return {
      studyPlan: validation.data,
      metadata: {
        rawJson: JSON.stringify(healed),
        model: GEMINI_MODEL,
        inputCharCount,
        chunksUsed: chunks.length,
        generationTimeMs: elapsedMs,
      },
    };
  } catch (err: any) {
    const elapsedMs = Date.now() - overallStart;
    const message = err?.message || String(err);

    console.error(`[Gemini] ===== GENERATION FAILED =====`);
    console.error(`[Gemini] Full error object:`, err);
    console.error(`[Gemini] Error name:`, err?.name);
    console.error(`[Gemini] Error message:`, message);
    console.error(`[Gemini] Error stack:`, err?.stack);
    console.error(`[Gemini] Elapsed time: ${elapsedMs}ms`);

    progress({ stage: "error", message: message });

    // Provide descriptive error messages
    if (message.includes("timed out")) {
      console.error(`[Gemini] Timeout error detected`);
      throw new Error("AI generation timed out. Please try again.");
    }
    if (message.includes("GEMINI_API_KEY")) {
      console.error(`[Gemini] API key error detected`);
      throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.");
    }
    if (message.includes("validation")) {
      console.error(`[Gemini] Validation error detected`);
      throw new Error("AI response did not match expected structure. Please try again.");
    }

    console.error(`[Gemini] Generic error, rethrowing`);
    throw new Error(`Failed to generate study plan: ${message}`);
  }
}

// ─── Export for testing ───────────────────────────────────────────────────────

export { extractJSON, parseJSON, splitIntoChunks };
