import axios, { AxiosError, CancelTokenSource } from "axios";
import { StudyPlan } from "../types/index.js";
import { validateStudyPlan } from "../utils/jsonValidator.js";

const API_BASE_URL = "http://localhost:5000/api";

// Create configured Axios instance
// Note: No authentication headers added - guest access enabled
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
});

// Active request cancel token tracker — only one AI request at a time
let activeCancelSource: CancelTokenSource | null = null;

export interface GenerateOptions {
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
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
 * Fetch a structured study plan from the backend AI service via Axios.
 */
export async function fetchStudyPlan(options: GenerateOptions): Promise<StudyPlan> {
  const { topic, difficulty } = options;

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
      { topic, difficulty },
      { cancelToken: cancelSource.token }
    );

    const result = response.data;

    if (!result.success || !result.data) {
      throw new ApiError("AI returned an unexpected response structure.", 502, true);
    }

    // 4. Client-side schema validation (never trust AI output)
    return validateStudyPlan(result.data);
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
        "Request timed out after 60 seconds. Try again or check your connection.",
        408,
        true
      );
    }

    // Axios Error mapping
    const axiosErr = error as AxiosError<any>;
    if (axiosErr.response) {
      const status = axiosErr.response.status;
      const data = axiosErr.response.data;
      const msg = data?.error?.message ?? `Request failed (HTTP ${status})`;

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

/**
 * Upload a document (PDF or TXT) to parse it via Axios.
 */
export async function uploadFileToServer(file: File): Promise<{
  text: string;
  wordCount: number;
  charCount: number;
  fileName: string;
  fileType: string;
  wasTruncated: boolean;
}> {
  if (!navigator.onLine) {
    throw new ApiError(
      "No internet connection detected. Please check your network and try again.",
      0,
      true
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const result = response.data;
    return result.data;
  } catch (error: any) {
    const axiosErr = error as AxiosError<any>;
    if (axiosErr.response) {
      const status = axiosErr.response.status;
      const data = axiosErr.response.data;
      const msg = data?.error?.message ?? `Upload failed (HTTP ${status})`;
      throw new ApiError(msg, status, status >= 500);
    }
    throw new ApiError("Cannot reach the backend server.", 0, true);
  }
}
