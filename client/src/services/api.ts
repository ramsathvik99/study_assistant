/**
 * api.ts — Axios client singleton.
 *
 * This is the ONLY file that constructs the Axios instance.
 * The base URL is driven entirely by the VITE_API_BASE_URL environment variable:
 *
 *   • Local dev  → create client/.env.local with:
 *                    VITE_API_BASE_URL=http://localhost:5000/api
 *   • Production → set VITE_API_BASE_URL in Vercel project environment variables:
 *                    VITE_API_BASE_URL=https://study-assistant-mg5l.onrender.com/api
 *
 * VITE_API_BASE_URL must be set - the app will not work without it.
 */

import axios, { AxiosError } from "axios";

// ─── Base URL ─────────────────────────────────────────────────────────────────

const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!rawBase) {
  throw new Error(
    "VITE_API_BASE_URL is not set. " +
    "For local dev, create client/.env.local with VITE_API_BASE_URL=http://localhost:5000/api. " +
    "For production, set VITE_API_BASE_URL in Vercel environment variables."
  );
}

// Strip any accidental trailing slash so paths appended by Axios are clean.
const API_BASE_URL = rawBase.replace(/\/+$/, "");

// Confirm the resolved URL at startup (visible in the browser console).
console.info(`[api] Base URL → ${API_BASE_URL}`);

// ─── Axios instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90_000,        // 90 s — Groq cold-starts can be slow on free tier
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // No cookies needed; guest-only access
});

// ─── Response interceptor ─────────────────────────────────────────────────────
//
// Normalises error shape so every caller gets a consistent `error.message`
// regardless of whether the failure is a network error, timeout, or HTTP error.

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: { message?: string }; message?: string }>) => {
    // Network / timeout — no response object
    if (!error.response) {
      if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
        error.message =
          "The request timed out. The AI service may be starting up — please try again.";
      } else {
        error.message =
          "Cannot reach the backend server. Check your connection or try again shortly.";
      }
      return Promise.reject(error);
    }

    // HTTP error — lift the server's message onto error.message for easy access
    const serverMsg =
      error.response.data?.error?.message ??
      (error.response.data as any)?.message;

    if (serverMsg && typeof serverMsg === "string") {
      error.message = serverMsg;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
