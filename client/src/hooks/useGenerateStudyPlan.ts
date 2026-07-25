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
 * Architecture:  React Component → this hook → studyApi → Express → Groq
 *
 * Responsibilities:
 *  1. Call studyApi.generate (HTTP transport layer)
 *  2. Run client-side validateStudyPlan (defence-in-depth — backend also validates)
 *  3. Build the StudySession and notify the component via onSuccess
 *  4. Handle every error class with a meaningful, actionable toast message
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

      // ── Step 1: HTTP call ───────────────────────────────────────────────────
      const response = await studyApi.generate(topic, difficulty);

      const responseTime = (Date.now() - requestStartTime) / 1000;

      // ── Step 2: Client-side schema validation ───────────────────────────────
      const validationStart = Date.now();
      let validatedPlan: StudyPlan;
      try {
        validatedPlan = validateStudyPlan(response.studyPlan);
      } catch (validationErr: any) {
        throw new Error(
          `Client validation failed: ${validationErr?.message ?? "Invalid study plan structure."}`
        );
      }
      const validationTime = (Date.now() - validationStart) / 1000;

      // ── Step 3: Build metadata ──────────────────────────────────────────────
      const rawJsonStr = response.rawJson ?? JSON.stringify(response.studyPlan, null, 2);
      const payloadSize = new Blob([rawJsonStr]).size;

      const warnings: string[] = [];
      if (!validatedPlan.quiz?.length)       warnings.push("Quiz section is empty");
      if (!validatedPlan.flashcards?.length) warnings.push("Flashcards section is empty");
      if (!validatedPlan.summary || validatedPlan.summary.length < 50)
        warnings.push("Summary is too short or missing");

      const debugMetadata: DebugMetadata = {
        requestTime:      requestStartTime,
        responseTime,
        timestamp:        requestStartTime,
        model:            response.model ?? "llama-3.3-70b-versatile",
        tokenUsage:       response.tokenUsage,
        validationStatus: "valid",
        validationTime,
        jsonParseTime:    0,
        payloadSize,
        warnings:         warnings.length > 0 ? warnings : undefined,
      };

      return { studyPlan: validatedPlan, debugMetadata, rawJson: rawJsonStr };
    },

    onSuccess: ({ studyPlan, debugMetadata, rawJson }, variables) => {
      const session: StudySession = {
        id:            `session-${Date.now()}`,
        topic:         variables.topic.slice(0, 80),
        timestamp:     Date.now(),
        studyPlan,
        isBookmarked:  false,
        debugMetadata,
        rawJson,
      };

      onSuccess(session);

      const label = session.topic.slice(0, 40);
      toast.success(
        `Study plan ready: "${label}${session.topic.length > 40 ? "…" : ""}"`,
        { duration: 4000 }
      );
      navigate("/session");
    },

    onError: (error: any) => {
      // Cancelled requests (user clicked Generate twice) are silent — the new
      // request is already in-flight and will show its own result/error.
      if (error?.isCancelled) return;

      const httpStatus: number | undefined =
        error?.response?.status ?? error?.status;

      const msg: string =
        error?.response?.data?.error?.message ??
        error?.message ??
        "Generation failed. Please try again.";

      // ── Rate limit ──────────────────────────────────────────────────────────
      if (httpStatus === 429) {
        toast.error(
          "Rate limit reached — please wait a moment before trying again.",
          { duration: 7000 }
        );
        return;
      }

      // ── Unprocessable AI output ─────────────────────────────────────────────
      if (httpStatus === 422) {
        toast.error(
          "The AI returned an invalid response. Please try a different topic.",
          { duration: 7000 }
        );
        return;
      }

      // ── Service unavailable (missing API key, etc.) ─────────────────────────
      if (httpStatus === 503) {
        toast.error(
          "The AI service is temporarily unavailable. Please try again shortly.",
          { duration: 6000 }
        );
        return;
      }

      // ── Network / timeout (no response) ────────────────────────────────────
      if (axios.isAxiosError(error) && !error.response) {
        toast.error(
          "Cannot reach the backend server. Check your connection or try again shortly.",
          { duration: 6000 }
        );
        return;
      }

      // ── Timeout specifically ────────────────────────────────────────────────
      if (error?.code === "ECONNABORTED" || msg.toLowerCase().includes("timeout")) {
        toast.error(
          "The request timed out. The AI may be starting up — please try again.",
          { duration: 6000 }
        );
        return;
      }

      // ── Client-side validation failure ─────────────────────────────────────
      if (
        msg.includes("Client validation failed") ||
        msg.includes("Invalid study plan") ||
        msg.includes("Key concepts")
      ) {
        toast.error(
          "The AI response failed validation. Please try again.",
          { duration: 7000 }
        );
        return;
      }

      // ── Bad request (validation errors from server) ─────────────────────────
      if (httpStatus === 400) {
        toast.error(`Invalid input: ${msg}`, { duration: 6000 });
        return;
      }

      // ── Fallback ────────────────────────────────────────────────────────────
      toast.error(msg.length > 120 ? msg.slice(0, 120) + "…" : msg, { duration: 5000 });
    },
  });
};
