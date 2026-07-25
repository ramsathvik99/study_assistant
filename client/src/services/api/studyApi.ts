/**
 * studyApi — HTTP transport layer for study plan generation.
 *
 * Responsibility: POST /api/generate and return the raw response body.
 * Validation and session-building happen in the hook layer (useGenerateStudyPlan).
 *
 * AbortController:
 *   Each call cancels the previous in-flight request before starting a new one,
 *   so double-clicks or rapid re-submits never allow a stale response to
 *   overwrite a newer one.
 */

import { apiClient } from "../api.js";
import { StudyPlan, DebugMetadata } from "../../types/index.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GenerateResponse {
  studyPlan:     StudyPlan;
  debugMetadata?: DebugMetadata;
  rawJson?:      string;
  model?:        string;
  tokenUsage?:   DebugMetadata["tokenUsage"];
}

// ─── In-flight request tracker ────────────────────────────────────────────────

let activeController: AbortController | null = null;

/** Cancel any currently in-flight generate request. */
export function cancelActiveGenerate(): void {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const studyApi = {
  /**
   * POST /api/generate
   *
   * Cancels any previous in-flight call before starting a new one so the UI
   * always reflects the most recent submission, not a stale earlier response.
   */
  generate: async (
    topic: string,
    difficulty: "Easy" | "Medium" | "Hard"
  ): Promise<GenerateResponse> => {
    // Cancel the previous request if still running
    cancelActiveGenerate();

    const controller = new AbortController();
    activeController = controller;

    try {
      const { data } = await apiClient.post<{
        success: boolean;
        data: StudyPlan;
        debugMetadata?: DebugMetadata;
        rawJson?:       string;
        model?:         string;
        tokenUsage?:    DebugMetadata["tokenUsage"];
      }>(
        "/generate",
        { topic, difficulty },
        { signal: controller.signal }
      );

      if (!data.success || !data.data) {
        throw new Error("Server returned an unexpected response structure.");
      }

      return {
        studyPlan:     data.data,
        debugMetadata: data.debugMetadata,
        rawJson:       data.rawJson,
        model:         data.model,
        tokenUsage:    data.tokenUsage,
      };
    } catch (err: any) {
      // Cancelled requests throw an AbortError — don't treat them as failures
      if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
        throw Object.assign(new Error("Request was cancelled."), { isCancelled: true });
      }
      throw err;
    } finally {
      // Clear the tracker once this call settles (success, error, or cancel)
      if (activeController === controller) {
        activeController = null;
      }
    }
  },
};
