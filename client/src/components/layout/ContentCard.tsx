import React from "react";
import { motion } from "framer-motion";

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Standard content card
 * 
 * EXACT SPECIFICATIONS:
 * - Background: white (#FFFFFF) / dark: #1E293B
 * - Border: 1px solid slate-200 / dark: slate-700
 * - Radius: rounded-2xl (16px)
 * - Padding: p-6 (24px all sides)
 * - Shadow: shadow-soft / dark: shadow-md
 * - Hover: slight lift + stronger shadow
 * 
 * EVERY card must use these values
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  children,
  className = "",
  hover = false,
  onClick,
}) => {
  const Component = hover ? motion.div : "div";
  const hoverProps = hover
    ? {
        whileHover: { y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`glass ${
        hover ? "glass-hover hover:-translate-y-0.5" : ""
      } ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};
