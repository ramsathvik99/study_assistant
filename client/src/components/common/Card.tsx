import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated" | "gradient" | "glass";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  onClick?: () => void;
  accent?: "primary" | "secondary" | "accent" | "emerald" | "purple" | "pink" | "indigo" | "none";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
  onClick,
  accent = "none",
}) => {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const variantStyles = {
    default: "glass",
    bordered: "glass border-2",
    elevated: "glass-strong shadow-lg dark:shadow-2xl",
    gradient: "glass-strong shadow-lg dark:shadow-2xl",
    glass: "glass",
  };

  const accentStyles = accent !== "none" 
    ? `border-l-4 transition-colors ${
        accent === "primary" ? "border-l-primary-500 dark:border-l-primary-400" :
        accent === "secondary" ? "border-l-secondary-500 dark:border-l-secondary-400" :
        accent === "accent" ? "border-l-accent-500 dark:border-l-accent-400" :
        accent === "emerald" ? "border-l-emerald-500 dark:border-l-emerald-400" :
        accent === "purple" ? "border-l-purple-500 dark:border-l-purple-400" :
        accent === "pink" ? "border-l-pink-500 dark:border-l-pink-400" :
        accent === "indigo" ? "border-l-indigo-500 dark:border-l-indigo-400" :
        ""
      }`
    : "";

  const hoverStyles = hover
    ? "hover:shadow-soft-xl dark:hover:shadow-2xl hover:-translate-y-1 cursor-pointer transition-all duration-200"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`rounded-3xl ${variantStyles[variant]} ${paddingStyles[padding]} ${accentStyles} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
};
