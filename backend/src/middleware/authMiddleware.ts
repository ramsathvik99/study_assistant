import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userStore } from "../utils/fileStore.js";

export interface AuthRequest extends Request {
  userId?: string;
  userName?: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme_insecure_default";

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: { message: "Authentication required. Please log in." },
    });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; name: string };
    // Confirm user still exists in store
    const user = userStore.findById(payload.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: "Account not found. Please log in again." },
      });
      return;
    }
    req.userId = payload.userId;
    req.userName = user.name;
    next();
  } catch (err: any) {
    const isExpired = err?.name === "TokenExpiredError";
    res.status(401).json({
      success: false,
      error: {
        message: isExpired
          ? "Session expired. Please log in again."
          : "Invalid session token. Please log in again.",
      },
    });
  }
}
