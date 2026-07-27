import React from "react";
import { motion } from "framer-motion";

interface AccentCardProps {
  children: React.ReactNode;
  accent?: "blue" | "emerald" | "indigo" | "violet" | "teal" | "amber" | "rose" | "cyan";
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Premium card with colored header accent
 * Creates visual depth and page-specific personality
 */
export const AccentCard: React.FC<AccentCardProps> = ({
  children,
  accent = "blue",
  hover = false,
  onClick,
  className = "",
}) => {
  const Component = hover ? motion.div : "div";
  const hoverProps = hover
    ? {
        whileHover: { y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  const accentColors = {
    blue: "border-t-primary-500",
    emerald: "border-t-emerald-500",
    indigo: "border-t-indigo-500",
    violet: "border-t-violet-500",
    teal: "border-t-teal-500",
    amber: "border-t-amber-500",
    rose: "border-t-rose-500",
    cyan: "border-t-cyan-500",
  };

  const accentBg = {
    blue: "bg-primary-50/30",
    emerald: "bg-emerald-50/30",
    indigo: "bg-indigo-50/30",
    violet: "bg-violet-50/30",
    teal: "bg-teal-50/30",
    amber: "bg-amber-50/30",
    rose: "bg-rose-50/30",
    cyan: "bg-cyan-50/30",
  };

  return (
    <Component
      onClick={onClick}
      className={`bg-surface-elevated border border-border ${accentColors[accent]} border-t-4 rounded-2xl overflow-hidden shadow-soft ${
        hover ? "cursor-pointer hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200" : ""
      } ${className}`}
      {...hoverProps}
    >
      <div className={`${accentBg[accent]} px-6 pt-6 pb-4`}>
        {React.Children.toArray(children)[0]}
      </div>
      <div className="px-6 pb-6">
        {React.Children.toArray(children).slice(1)}
      </div>
    </Component>
  );
};
