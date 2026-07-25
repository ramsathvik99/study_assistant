import { apiClient } from "../api.js";

export interface ParsedFileResult {
  text: string;
  wordCount: number;
  charCount: number;
  fileName: string;
  fileType: string;
  wasTruncated: boolean;
}

export const uploadApi = {
  /** POST /api/upload — parse PDF / TXT / MD files */
  parseFile: async (file: File): Promise<ParsedFileResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!data.success || !data.data) {
      throw new Error("File parsing failed.");
    }

    return data.data as ParsedFileResult;
  },
};
