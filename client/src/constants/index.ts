// ─── App Constants ────────────────────────────────────────────────────────────

export const APP_NAME = "AI Study Assistant";
export const APP_VERSION = "2.0.0";
export const APP_DESCRIPTION = "AI-powered study platform — flashcards, quizzes, roadmaps";

// ─── API ──────────────────────────────────────────────────────────────────────

// Kept for reference only. The canonical base URL lives in services/api.ts.
// Use VITE_API_BASE_URL (not VITE_API_URL) in your .env files.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_TIMEOUT_MS = 90_000; // 90s — Groq cold-starts can be slow

// ─── Upload ───────────────────────────────────────────────────────────────────

export const MAX_UPLOAD_SIZE_MB = 15;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
export const SUPPORTED_UPLOAD_TYPES = ["application/pdf", "text/plain", "text/markdown"] as const;
export const SUPPORTED_UPLOAD_EXTENSIONS = [".pdf", ".txt", ".md"] as const;

// ─── Study ────────────────────────────────────────────────────────────────────

export const MAX_TOPIC_LENGTH = 50_000;
export const MAX_NOTES_WORD_COUNT = 8_000;
export const HISTORY_MAX_ITEMS = 200;

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;

// ─── LocalStorage Keys ────────────────────────────────────────────────────────

export const LS_KEYS = {
  history:       "study-history",
  activeSession: "study-active-session",
  stats:         "study-stats",
  settings:      "study-settings",
} as const;

// ─── TanStack Query ───────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  studyPlan: "study-plan",
  history:   "history",
  dashboard: "dashboard",
} as const;
