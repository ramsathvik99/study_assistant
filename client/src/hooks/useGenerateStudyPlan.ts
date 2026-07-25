import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { studyApi } from "../services/api/studyApi.js";
import { validateStudyPlan } from "../utils/jsonValidator.js";
import { StudySession, StudyPlan, DebugMetadata } from "../types/index.js";

interface UseGenerateStudyPlanOptions {
  onSuccess: (session: StudySession) => void;
}

/**
 * useGenerateStudyPlan — Custom hook.
 *
 * Architecture layer: React Component → this hook → studyApi → Express → Groq
 *
 * Responsibilities:
 *  1. Call studyApi.generate (HTTP transport)
 *  2. Run client-side validateStudyPlan (never trust AI output)
 *  3. Build the StudySession and notify the component via onSuccess
 *  4. Manage all toast feedback for loading / success / error states
 *
 * Components that use this hook never import studyApi, apiClient, or
 * validateStudyPlan directly.
 */
export const useGenerateStudyPlan = ({ onSuccess }: UseGenerateStudyPlanOptions) => {
  const navigate = useNavigate();

  return useMutation<
    { studyPlan: StudyPlan; debugMetadata: DebugMetadata; rawJson: string },
    Error,
    { topic: string; difficulty: "Easy" | "Medium" | "Hard" }
  >({
    mutationFn: async ({ topic, difficulty }) => {
      const requestStartTime = Date.now();
      
      // Step 1: HTTP transport via service
      const response = await studyApi.generate(topic, difficulty);
      
      const requestEndTime = Date.now();
      const responseTime = (requestEndTime - requestStartTime) / 1000; // Convert to seconds

      // Step 2: Client-side validation (defence-in-depth — backend also validates)
      const validationStartTime = Date.now();
      const validatedPlan = validateStudyPlan(response.studyPlan);
      const validationEndTime = Date.now();
      const validationTime = (validationEndTime - validationStartTime) / 1000;

      // Calculate payload size
      const payloadSize = new Blob([response.rawJson || JSON.stringify(response.studyPlan)]).size;

      // Build warnings
      const warnings: string[] = [];
      if (!response.studyPlan.quiz || response.studyPlan.quiz.length === 0) {
        warnings.push("⚠ Quiz section is empty");
      }
      if (!response.studyPlan.flashcards || response.studyPlan.flashcards.length === 0) {
        warnings.push("⚠ Flashcards section is empty");
      }
      if (!response.studyPlan.summary || response.studyPlan.summary.length < 50) {
        warnings.push("⚠ Summary is too short or missing");
      }

      // Build debug metadata
      const debugMetadata: DebugMetadata = {
        requestTime: requestStartTime,
        responseTime,
        timestamp: requestStartTime,
        model: response.model || "llama-3.3-70b-versatile",
        tokenUsage: response.tokenUsage,
        validationStatus: "valid",
        validationTime,
        jsonParseTime: 0, // Already included in validation time
        payloadSize,
        warnings: warnings.length > 0 ? warnings : undefined,
      };

      return {
        studyPlan: validatedPlan,
        debugMetadata,
        rawJson: response.rawJson || JSON.stringify(response.studyPlan, null, 2),
      };
    },

    onSuccess: ({ studyPlan, debugMetadata, rawJson }, variables) => {
      // Step 3: Build session and propagate to component
      const session: StudySession = {
        id: `session-${Date.now()}`,
        topic: variables.topic.slice(0, 80),
        timestamp: Date.now(),
        studyPlan,
        isBookmarked: false,
        debugMetadata,
        rawJson,
      };

      onSuccess(session);

      const label = session.topic.slice(0, 40);
      toast.success(`Study plan ready: "${label}${session.topic.length > 40 ? "…" : ""}"!`);
      navigate("/session");
    },

    onError: (error: any) => {
      // Step 4: Classify error and show appropriate toast
      const httpStatus: number | undefined = error?.response?.status ?? error?.status;
      const msg: string =
        error?.response?.data?.error?.message ??
        error?.message ??
        "Generation failed. Please try again.";

      if (httpStatus === 429) {
        toast.error("Rate limit hit — please wait a moment before trying again.", {
          duration: 7000,
        });
      } else if (httpStatus === 422) {
        toast.error(
          "The AI returned an invalid response. Please try a different topic.",
          { duration: 7000 }
        );
      } else if (httpStatus === 503) {
        toast.error("The AI service is currently unavailable. Please try again shortly.");
      } else if (axios.isAxiosError(error) && !error.response) {
        toast.error(
          "Cannot reach the backend server. Is it running on port 5000?"
        );
      } else if (msg.includes("Invalid study plan") || msg.includes("Key concepts")) {
        toast.error(
          "AI response failed client-side validation. Please try again.",
          { duration: 7000 }
        );
      } else {
        toast.error(msg);
      }
    },
  });
};
