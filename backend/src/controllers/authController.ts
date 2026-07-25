import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userStore, User } from "../utils/fileStore.js";
import { RegisterSchema, LoginSchema } from "../validators/authValidator.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme_insecure_default";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as string) ?? "7d";
const SALT_ROUNDS = 12;

function signToken(user: User): string {
  return jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function safeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    avatar: user.avatar ?? null,
  };
}

// POST /api/auth/register
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map((e) => e.message).join(". ");
      res.status(400).json({ success: false, error: { message: messages } });
      return;
    }

    const { name, email, password } = parsed.data;

    if (userStore.findByEmail(email)) {
      res.status(409).json({
        success: false,
        error: { message: "An account with this email already exists." },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = userStore.create({ name, email, passwordHash });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      data: { token, user: safeUser(user) },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { message: "Please enter a valid email and password." },
      });
      return;
    }

    const { email, password } = parsed.data;
    const user = userStore.findByEmail(email);

    // Constant-time response to prevent user enumeration
    const dummyHash = "$2a$12$invalidhashfortimingnormalization";
    const isValid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : (await bcrypt.compare(password, dummyHash), false);

    if (!user || !isValid) {
      res.status(401).json({
        success: false,
        error: { message: "Incorrect email or password." },
      });
      return;
    }

    const token = signToken(user);
    res.status(200).json({
      success: true,
      data: { token, user: safeUser(user) },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me  (requires auth middleware)
export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = userStore.findById(req.userId!);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: "User not found." },
      });
      return;
    }
    res.status(200).json({ success: true, data: { user: safeUser(user) } });
  } catch (err) {
    next(err);
  }
}
