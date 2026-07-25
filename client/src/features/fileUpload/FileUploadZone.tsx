import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, FileText, X, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { useFileUpload } from "../../hooks/useFileUpload.js";
import { Button } from "../../components/common/Button.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain":      [".txt"],
  "text/markdown":   [".md"],
};
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileUploadZoneProps {
  onUploadSuccess: (parsedText: string, fileName: string) => void;
}
interface SuccessInfo {
  fileName: string;
  wordCount: number;
  wasTruncated: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onUploadSuccess }) => {
  const [file, setFile]             = useState<File | null>(null);
  const [dropError, setDropError]   = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);

  const { mutate: parseFile, isPending: loading } = useFileUpload({
    onSuccess: (parsedText, fileName) => {
      setSuccessInfo({
        fileName,
        wordCount: parsedText.trim().split(/\s+/).filter(Boolean).length,
        wasTruncated: parsedText.length > 40_000,
      });
      onUploadSuccess(parsedText, fileName);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejections: FileRejection[]) => {
    setDropError(null);
    setSuccessInfo(null);

    if (rejections.length > 0) {
      const codes = rejections[0].errors.map((e) => e.code);
      if (codes.includes("file-too-large"))
        setDropError("File exceeds the 15 MB limit. Please upload a smaller file.");
      else if (codes.includes("file-invalid-type"))
        setDropError("Unsupported format. Please upload a PDF, TXT, or MD file.");
      else
        setDropError("File rejected. Please check the file and try again.");
      return;
    }
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    multiple: false,
    disabled: loading || !!successInfo,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setDropError(null);
    setSuccessInfo(null);
  };

  const handleUpload = () => {
    if (!file) return;
    setSuccessInfo(null);
    parseFile(file);
  };

  return (
    <div className="space-y-4">
      {/* ── Drop zone ──────────────────────────────────────────────────── */}
      <div
        {...getRootProps()}
        className={[
          "relative rounded-xl border-2 border-dashed p-10",
          "flex flex-col items-center justify-center gap-4 text-center",
          "transition-all duration-200 select-none cursor-pointer outline-none",
          successInfo
            ? "border-jade-500/40 bg-jade-500/5 cursor-default"
            : isDragActive
            ? "border-amber-500/70 bg-amber-500/8 scale-[1.01]"
            : file
            ? "border-amber-500/30 bg-amber-500/4 cursor-default"
            : "border-[rgba(255,255,255,0.1)] hover:border-amber-500/40 hover:bg-amber-500/4",
        ].join(" ")}
      >
        <input {...getInputProps()} />

        {!file ? (
          <>
            <div className={[
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
              isDragActive ? "bg-amber-500/20 text-amber-400" : "bg-void-800 text-void-500",
            ].join(" ")}>
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-void-200 font-medium text-sm">
                {isDragActive ? "Drop it here" : "Drag and drop your file"}
              </p>
              <p className="text-void-500 text-xs mt-1">PDF, TXT, or MD · max 15 MB</p>
            </div>
            {!isDragActive && (
              <span className="px-3 py-1.5 rounded-lg bg-void-800 border border-[rgba(255,255,255,0.08)] text-void-400 text-xs font-medium">
                or click to browse
              </span>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-between bg-void-800 border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-amber-500/12 border border-amber-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="text-void-100 font-medium text-sm truncate">{file.name}</p>
                <p className="text-void-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!loading && !successInfo && (
              <button
                onClick={handleRemove}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-void-500 hover:text-void-200 hover:bg-void-700 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Error banner ──────────────────────────────────────────────── */}
      {dropError && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-rose-500/8 border border-rose-500/25 text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{dropError}</span>
        </div>
      )}

      {/* ── Success banner ─────────────────────────────────────────────── */}
      {successInfo && (
        <div className="space-y-1.5 p-3.5 rounded-lg bg-jade-500/8 border border-jade-500/25 text-jade-400 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Parsed <span className="font-semibold">{successInfo.fileName}</span>
              {" — "}{successInfo.wordCount.toLocaleString()} words extracted
            </span>
          </div>
          {successInfo.wasTruncated && (
            <p className="pl-6 text-amber-400 text-xs">
              Content was truncated to fit the AI context window.
            </p>
          )}
        </div>
      )}

      {/* ── Parse button ──────────────────────────────────────────────── */}
      {file && !successInfo && (
        <Button
          onClick={handleUpload}
          disabled={loading}
          variant="amber"
          size="md"
          isLoading={loading}
          icon={!loading ? <Sparkles className="w-3.5 h-3.5" /> : undefined}
          className="w-full"
        >
          {loading ? "Parsing document…" : "Parse document"}
        </Button>
      )}
    </div>
  );
};

export default FileUploadZone;
