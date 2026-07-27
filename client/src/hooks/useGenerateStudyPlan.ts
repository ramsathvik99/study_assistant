import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchStudyPlan, cancelActiveRequest, getNextRequestSequence, isResponseStale } from "../services/api";
import { validateStudyPlan } from "../utils/jsonValidator";
import { useSettings } from "./useSettings";
import { getErrorInfo, isRetryableError } from "../utils/errorHandler";
import { StudySession, StudyPlan, DebugMetadata } from "../types/index";

interface UseGenerateStudyPlanOptions {
  onSuccess: (session: StudySession) => void;
  onError?: (errorInfo: ReturnType<typeof getErrorInfo>) => void;
}

/**
 * useGenerateStudyPlan — Custom hook with Settings integration and stale response prevention.
 *
 * Features:
 * - Request sequence tracking to prevent stale responses
 * - Automatic cancellation on unmount
 * - Cancellation on navigation
 * - Uses AI settings for model, temperature, response length, streaming, output sections, difficulty
 */
export const useGenerateStudyPlan = ({ onSuccess, onError }: UseGenerateStudyPlanOptions) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const requestSequenceRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Cancel on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cancelActiveRequest();
    };
  }, []);

  return useMutation<
    { studyPlan: StudyPlan; debugMetadata: DebugMetadata; rawJson: string },
    Error,
    { topic: string; difficulty?: "Easy" | "Medium" | "Hard" }
  >({
    mutationFn: async ({ topic, difficulty }) => {
      const requestStartTime = Date.now();
      
      // Generate sequence for this request to detect stale responses
      const currentSequence = getNextRequestSequence();
      requestSequenceRef.current = currentSequence;
      
      // Use settings for AI request parameters
      const aiDifficulty = difficulty || settings.defaultDifficulty;
      
      // Step 1: HTTP transport via service with settings
      const { studyPlan, requestSequence } = await fetchStudyPlan({ 
        topic, 
        difficulty: aiDifficulty,
        model: settings.aiModel,
        temperature: settings.temperature,
        responseLength: settings.responseLength,
        streamingEnabled: settings.streamingEnabled,
        defaultOutputSections: settings.defaultOutputSections,
      }, currentSequence);
      
      // Check if this response is stale (a newer request already succeeded)
      if (isResponseStale(requestSequence)) {
        console.log(`[useGenerateStudyPlan] Ignoring stale response (seq ${requestSequence})`);
        throw new Error("__STALE_RESPONSE__");
      }
      
      const requestEndTime = Date.now();
      const responseTime = (requestEndTime - requestStartTime) / 1000; // Convert to seconds

      // Step 2: Client-side validation (defence-in-depth — backend also validates)
      const validationStartTime = Date.now();
      const validatedPlan = validateStudyPlan(studyPlan);
      const validationEndTime = Date.now();
      const validationTime = (validationEndTime - validationStartTime) / 1000;

      // Calculate payload size
      const payloadSize = new Blob([JSON.stringify(studyPlan)]).size;

      // Build warnings
      const warnings: string[] = [];
      if (!studyPlan.quiz || studyPlan.quiz.length === 0) {
        warnings.push("⚠ Quiz section is empty");
      }
      if (!studyPlan.flashcards || studyPlan.flashcards.length === 0) {
        warnings.push("⚠ Flashcards section is empty");
      }
      if (!studyPlan.summary || studyPlan.summary.length < 50) {
        warnings.push("⚠ Summary is too short or missing");
      }

      // Build debug metadata
      const debugMetadata: DebugMetadata = {
        requestTime: requestStartTime,
        responseTime,
        timestamp: requestStartTime,
        model: settings.aiModel,
        validationStatus: "valid",
        validationTime,
        jsonParseTime: 0, // Already included in validation time
        payloadSize,
        warnings: warnings.length > 0 ? warnings : undefined,
      };

      return {
        studyPlan: validatedPlan,
        debugMetadata,
        rawJson: JSON.stringify(studyPlan, null, 2),
      };
    },

    onSuccess: ({ studyPlan, debugMetadata, rawJson }, variables) => {
      console.log("[useGenerateStudyPlan] onSuccess called with studyPlan:", studyPlan);
      console.log("[useGenerateStudyPlan] Study plan keys:", Object.keys(studyPlan));

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

      console.log("[useGenerateStudyPlan] Calling onSuccess with session:", session);
      onSuccess(session);

      const label = session.topic.slice(0, 40);
      toast.success(`Study plan ready: "${label}${session.topic.length > 40 ? "…" : ""}"!`);
      console.log("[useGenerateStudyPlan] Navigating to /session");
      navigate("/session");
    },

    onError: (error: any) => {
      // Ignore stale responses silently
      if (error.message === "__STALE_RESPONSE__" || error.message === "__CANCELLED__") {
        console.log("[useGenerateStudyPlan] Request cancelled or stale, not showing error");
        return;
      }

      const errorInfo = getErrorInfo(error);
      
      // Call the onError callback if provided (for ErrorToast integration)
      if (onError) {
        onError(errorInfo);
      } else {
        // Fallback to react-hot-toast if no callback provided
        toast.error(errorInfo.message, { duration: 7000 });
      }
    },
  });
};
