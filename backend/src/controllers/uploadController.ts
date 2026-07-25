import { Request, Response, NextFunction } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";

// ─── Multer config ──────────────────────────────────────────────────────────

const ALLOWED_MIMES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type "${file.mimetype}". Please upload a PDF or TXT file.`
        )
      );
    }
  },
});

// ─── Controller ─────────────────────────────────────────────────────────────

/**
 * POST /api/upload
 * Accepts: multipart/form-data with field "file"
 * Returns: { text, wordCount, charCount, fileType, fileName }
 */
export async function uploadFile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: { message: "No file provided. Please attach a PDF or TXT file." },
      });
      return;
    }

    const { mimetype, originalname, buffer } = req.file;
    let text = "";

    if (mimetype === "application/pdf") {
      const result = await pdfParse(buffer);
      text = result.text?.trim() ?? "";

      if (!text) {
        res.status(422).json({
          success: false,
          error: {
            message:
              "Could not extract text from this PDF. It may be scanned or image-based (OCR coming in Phase 2).",
          },
        });
        return;
      }
    } else {
      // TXT / Markdown
      text = buffer.toString("utf-8").trim();
    }

    if (text.length < 10) {
      res.status(422).json({
        success: false,
        error: { message: "The uploaded file appears to be empty or too short." },
      });
      return;
    }

    // Truncate very long documents to 8000 words to fit Groq context
    const words = text.split(/\s+/);
    const truncated = words.length > 8000 ? words.slice(0, 8000).join(" ") + "\n\n[... document truncated to 8000 words for AI processing ...]" : text;

    res.status(200).json({
      success: true,
      data: {
        text: truncated,
        wordCount: words.length,
        charCount: text.length,
        fileType: mimetype === "application/pdf" ? "pdf" : "txt",
        fileName: originalname,
        wasTruncated: words.length > 8000,
      },
    });
  } catch (err) {
    next(err);
  }
}
