import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  status?:     number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // CORS errors arrive here from the cors() middleware
  if (err.message?.startsWith("CORS:")) {
    res.status(403).json({
      success: false,
      error: { message: err.message, status: 403 },
    });
    return;
  }

  const statusCode = err.statusCode ?? err.status ?? 500;
  const message    = err.message ?? "Internal Server Error";

  console.error(`[Error] ${req.method} ${req.path} → ${statusCode}: ${message}`);
  if (statusCode === 500) {
    console.error("[Error] Stack:", err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: { message, status: statusCode },
  });
}
