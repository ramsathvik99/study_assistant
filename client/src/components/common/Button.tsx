import React from "react";
import { Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass" | "amber";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
  className?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "h-7  px-2.5 text-[11px] rounded-md  gap-1.5",
  sm: "h-8  px-3   text-xs    rounded-lg  gap-1.5",
  md: "h-9  px-4   text-[13px] rounded-lg  gap-2",
  lg: "h-11 px-5   text-sm    rounded-xl  gap-2",
};

const VARIANT: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-void-800 text-void-50 border border-void-700 hover:bg-void-700 hover:border-void-600 active:bg-void-800",
  amber:
    "bg-amber-500 text-void-950 font-semibold border border-amber-400 hover:bg-amber-400 active:bg-amber-600 shadow-glow-amber",
  secondary:
    "bg-transparent text-void-200 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.18)] hover:text-void-50 hover:bg-[rgba(255,255,255,0.04)]",
  ghost:
    "bg-transparent text-void-400 border border-transparent hover:text-void-100 hover:bg-[rgba(255,255,255,0.05)]",
  danger:
    "bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40",
  glass:
    "bg-[rgba(255,255,255,0.05)] text-void-200 border border-[rgba(255,255,255,0.1)] backdrop-blur hover:bg-[rgba(255,255,255,0.09)] hover:text-void-50",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconEnd,
  className = "",
  disabled,
  ...props
}) => (
  <button
    className={[
      "focus-ring inline-flex items-center justify-center font-medium",
      "transition-all duration-150 ease-out",
      "disabled:pointer-events-none disabled:opacity-40",
      "select-none whitespace-nowrap",
      SIZE[size],
      VARIANT[variant],
      className,
    ].join(" ")}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : (
      icon && <span className="shrink-0">{icon}</span>
    )}
    {children}
    {!isLoading && iconEnd && <span className="shrink-0">{iconEnd}</span>}
  </button>
);

export default Button;
