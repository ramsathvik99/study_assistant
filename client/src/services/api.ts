import axios, { AxiosError, CancelTokenSource } from "axios";
import { StudyPlan } from "../types/index";
import { validateStudyPlan } from "../utils/jsonValidator";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "/api";

// Create configured Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000, // 2 minutes
});

// Active request cancel token tracker — only one AI request at a time
let activeCancelSource: CancelTokenSource | null = null;

// Request sequence tracking — prevents stale responses
let requestSequence = 0;
let lastSuccessfulSequence = 0;

export interface GenerateOptions {
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  model?: string;
  temperature?: number;
  responseLength?: "short" | "medium" | "detailed";
  streamingEnabled?: boolean;
  defaultOutputSections?: {
    summary: boolean;
    keyConcepts: boolean;
    flashcards: boolean;
    quiz: boolean;
    checklist: boolean;
    roadmap: boolean;
    importantTerms: boolean;
    tips: boolean;
  };
}

export class ApiError extends Error {
  public status?: number;
  public isRetryable: boolean;

  constructor(message: string, status?: number, isRetryable = true) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isRetryable = isRetryable;
  }
}

/**
 * Cancel any in-flight request.
 */
export function cancelActiveRequest(): void {
  if (activeCancelSource) {
    activeCancelSource.cancel("__CANCELLED__");
    activeCancelSource = null;
  }
}

/**
 * Get the next request sequence number (for stale response detection)
 */
export function getNextRequestSequence(): number {
  return ++requestSequence;
}

/**
 * Check if a response is stale (newer request already succeeded)
 */
export function isResponseStale(responseSequence: number): boolean {
  return responseSequence < lastSuccessfulSequence;
}

/**
 * Fetch a structured study plan from the backend AI service via Axios.
 * Now with request sequence tracking to prevent stale responses.
 */
export async function fetchStudyPlan(options: GenerateOptions, requestSequence?: number): Promise<{ studyPlan: StudyPlan; requestSequence: number }> {
  const { topic, difficulty, model, temperature, responseLength, streamingEnabled, defaultOutputSections } = options;
  const seq = requestSequence ?? getNextRequestSequence();

  // 1. Offline check
  if (!navigator.onLine) {
    throw new ApiError(
      "No internet connection detected. Please check your network and try again.",
      0,
      true
    );
  }

  // 2. Cancel any previous stale request
  cancelActiveRequest();

  // 3. Create fresh cancel source for this request
  const cancelSource = axios.CancelToken.source();
  activeCancelSource = cancelSource;

  try {
    const response = await apiClient.post(
      "/generate",
      { 
        topic, 
        difficulty,
        model,
        temperature,
        responseLength,
        streamingEnabled,
        defaultOutputSections
      },
      { cancelToken: cancelSource.token }
    );

    console.log("[api.ts] ===== RAW HTTP RESPONSE =====");
    console.log("[api.ts] Raw API response:", response);
    console.log("[api.ts] Response data:", response.data);

    const result = response.data;

    if (!result.success || !result.data) {
      const errorMsg = result?.error?.message || "AI returned an unexpected response structure.";
      console.error("[api.ts] Validation failed:", { success: result.success, hasData: !!result.data, errorMsg });
      throw new ApiError(errorMsg, 502, true);
    }

    console.log("[api.ts] Parsed study plan data:", result.data);

    // 4. Client-side schema validation (never trust AI output)
    const studyPlan = validateStudyPlan(result.data);
    
    // Mark this sequence as successful for future stale detection
    lastSuccessfulSequence = Math.max(lastSuccessfulSequence, seq);

    return { studyPlan, requestSequence: seq };
  } catch (error: any) {
    if (axios.isCancel(error)) {
      if (error.message === "__CANCELLED__") {
        throw new ApiError("__CANCELLED__", 0, false);
      }
      throw new ApiError(
        "Request timed out. Try a shorter topic or check your connection.",
        408,
        true
      );
    }

    if (error instanceof ApiError) throw error;

    if (error.code === "ECONNABORTED") {
      throw new ApiError(
        "Request timed out after 120 seconds. Try again or check your connection.",
        408,
        true
      );
    }

    // Axios Error mapping - distinguish between different error types
    const axiosErr = error as AxiosError<any>;
    if (axiosErr.response) {
      const status = axiosErr.response.status;
      const data = axiosErr.response.data;
      const msg = data?.error?.message ?? `Request failed (HTTP ${status})`;

      // Check for specific error patterns in the message
      if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
        throw new ApiError(
          "Invalid API key. Please check your backend configuration.",
          401,
          false
        );
      }
      if (msg.includes("quota") || msg.includes("429") || msg.includes("Too Many Requests")) {
        throw new ApiError(
          "API quota exceeded. Please wait a moment before trying again.",
          429,
          true
        );
      }
      if (msg.includes("model not found") || msg.includes("Model not found")) {
        throw new ApiError(
          "AI model not found. Please check your backend configuration.",
          404,
          false
        );
      }
      if (msg.includes("permission denied") || msg.includes("Permission denied")) {
        throw new ApiError(
          "Permission denied. Please check your API key permissions.",
          403,
          false
        );
      }
      if (status === 429) {
        throw new ApiError(
          "You're generating too quickly. Please wait a moment before trying again.",
          429,
          true
        );
      }
      if (status === 503) {
        throw new ApiError(
          "The AI service is temporarily unavailable. Please try again shortly.",
          503,
          true
        );
      }
      throw new ApiError(msg, status, status >= 500);
    }

    throw new ApiError(
      "Cannot reach the backend server. Make sure it is running on port 5000.",
      0,
      true
    );
  } finally {
    if (activeCancelSource === cancelSource) {
      activeCancelSource = null;
    }
  }
}
