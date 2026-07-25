import React from "react";
import { motion, MotionProps } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** Lift card slightly on hover */
  animateHover?: boolean;
  animationsEnabled?: boolean;
  /** Visual variant */
  variant?: "default" | "raised" | "inset" | "ghost" | "amber";
  /** Deprecated legacy props — kept for backward compat, ignored visually */
  accent?: string;
  glowColor?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const VARIANT: Record<string, string> = {
  default: "card p-5",
  raised:  "card-raised p-5",
  inset:   "bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-5",
  ghost:   "border border-transparent bg-transparent rounded-xl p-5",
  amber:   "bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-xl p-5 hover:border-[rgba(245,158,11,0.35)]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  animateHover = false,
  animationsEnabled = true,
  variant = "default",
  accent: _accent,
  glowColor: _glowColor,
  ...rest
}) => {
  const base = `${VARIANT[variant] ?? VARIANT.default} ${className}`;

  if (animateHover && animationsEnabled) {
    // Strip non-motion HTML attrs from rest to avoid TS errors
    const { onClick, style, id, "aria-label": al, tabIndex, ...motionRest } = rest as any;
    return (
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.18 } }}
        className={base}
        onClick={onClick}
        style={style}
        id={id}
        aria-label={al}
        tabIndex={tabIndex}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} {...rest}>
      {children}
    </div>
  );
};

export default Card;
