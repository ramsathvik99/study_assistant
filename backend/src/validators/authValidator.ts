import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email too long")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
