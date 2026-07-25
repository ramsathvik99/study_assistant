import { apiClient } from "../api.js";
import { StudyPlan, DebugMetadata } from "../../types/index.js";

interface GenerateResponse {
  studyPlan: StudyPlan;
  debugMetadata?: DebugMetadata;
  rawJson?: string;
  model?: string;
  tokenUsage?: DebugMetadata["tokenUsage"];
}

/**
 * studyApi — Service layer.
 *
 * Responsibility: HTTP transport only.
 * - Calls Express /api/generate
 * - Returns the raw parsed JSON body with debug metadata
 * - Does NOT validate or transform the AI response
 *
 * Validation happens in the hook layer (useGenerateStudyPlan)
 * after this function returns, keeping concerns separated.
 */
export const studyApi = {
  generate: async (
    topic: string,
    difficulty: "Easy" | "Medium" | "Hard"
  ): Promise<GenerateResponse> => {
    const { data } = await apiClient.post<{ 
      success: boolean; 
      data: StudyPlan;
      debugMetadata?: DebugMetadata;
      rawJson?: string;
      model?: string;
      tokenUsage?: DebugMetadata["tokenUsage"];
    }>(
      "/generate",
      { topic, difficulty }
    );

    if (!data.success || !data.data) {
      throw new Error("Server returned an unexpected response structure.");
    }

    // Return the raw data with metadata — the hook will run validateStudyPlan on it
    return {
      studyPlan: data.data,
      debugMetadata: data.debugMetadata,
      rawJson: data.rawJson,
      model: data.model,
      tokenUsage: data.tokenUsage,
    };
  },
};
