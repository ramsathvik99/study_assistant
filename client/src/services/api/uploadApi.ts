/**
 * uploadApi — HTTP transport layer for file parsing.
 *
 * Responsibility: POST /api/upload with multipart/form-data and return
 * the parsed result. Error normalisation is handled by the Axios interceptor
 * in api.ts; this file is transport-only.
 */

import { apiClient } from "../api.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParsedFileResult {
  text:        string;
  wordCount:   number;
  charCount:   number;
  fileName:    string;
  fileType:    string;
  wasTruncated: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const uploadApi = {
  /** POST /api/upload — parse PDF / TXT / MD files via multipart form. */
  parseFile: async (file: File): Promise<ParsedFileResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<{
      success: boolean;
      data: ParsedFileResult;
    }>(
      "/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        // Upload can be slow for large PDFs — give it extra time
        timeout: 60_000,
      }
    );

    if (!data.success || !data.data) {
      throw new Error("File parsing failed — server returned an unexpected response.");
    }

    return data.data;
  },
};
