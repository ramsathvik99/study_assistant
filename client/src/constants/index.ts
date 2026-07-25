// ─── App Constants ────────────────────────────────────────────────────────────

export const APP_NAME = "AI Study Assistant";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "Production-scale AI-powered learning platform";

// ─── API ──────────────────────────────────────────────────────────────────────

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
export const API_TIMEOUT_MS = 60_000; // 60s — Groq can be slow on large inputs

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
  history: (userId: string) => `study-history-${userId}`,
  activeSession: (userId: string) => `study-active-session-${userId}`,
  stats: (userId: string) => `study-stats-${userId}`,
  settings: "study-settings",
  token: "auth-token",
  user: "auth-user",
} as const;

// ─── TanStack Query ───────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  studyPlan: "study-plan",
  history: "history",
  dashboard: "dashboard",
  goals: "goals",
  user: "user",
} as const;
