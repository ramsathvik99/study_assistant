import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadApi, ParsedFileResult } from "../services/api/uploadApi.js";

interface UseFileUploadOptions {
  onSuccess: (parsedText: string, fileName: string) => void;
}

/**
 * Hook that owns the file → backend → parsed-text call chain.
 * Components call mutate(file) and receive callbacks — they never touch uploadApi.
 */
export const useFileUpload = ({ onSuccess }: UseFileUploadOptions) => {
  return useMutation<ParsedFileResult, Error, File>({
    mutationFn: (file: File) => uploadApi.parseFile(file),
    onSuccess: (result) => {
      toast.success(
        `Extracted ${result.wordCount.toLocaleString()} words${
          result.wasTruncated ? " (truncated to 8k)" : ""
        } from "${result.fileName}"`,
        { duration: 5000 }
      );
      onSuccess(result.text, result.fileName);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "File parsing failed. Please try again.";
      toast.error(msg);
    },
  });
};
