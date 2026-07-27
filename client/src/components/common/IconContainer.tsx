import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface IconContainerProps {
  icon: LucideIcon;
  color?: "primary" | "secondary" | "accent" | "emerald" | "purple" | "pink" | "indigo" | "slate";
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "gradient" | "solid" | "light";
  className?: string;
  animate?: boolean;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  icon: Icon,
  color = "primary",
  size = "md",
  variant = "gradient",
  className = "",
  animate = false,
}) => {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const colorStyles = {
    gradient: {
      primary: "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-elevation-2",
      secondary: "bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-elevation-2",
      accent: "bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-elevation-2",
      emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-elevation-2",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-elevation-2",
      pink: "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-elevation-2",
      indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-elevation-2",
      slate: "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-elevation-2",
    },
    solid: {
      primary: "bg-primary-500 text-white shadow-elevation-1",
      secondary: "bg-secondary-500 text-white shadow-elevation-1",
      accent: "bg-accent-500 text-white shadow-elevation-1",
      emerald: "bg-emerald-500 text-white shadow-elevation-1",
      purple: "bg-purple-500 text-white shadow-elevation-1",
      pink: "bg-pink-500 text-white shadow-elevation-1",
      indigo: "bg-indigo-500 text-white shadow-elevation-1",
      slate: "bg-slate-500 text-white shadow-elevation-1",
    },
    light: {
      primary: "bg-primary-100 text-primary-600 border-2 border-primary-200",
      secondary: "bg-secondary-100 text-secondary-600 border-2 border-secondary-200",
      accent: "bg-accent-100 text-accent-600 border-2 border-accent-200",
      emerald: "bg-emerald-100 text-emerald-600 border-2 border-emerald-200",
      purple: "bg-purple-100 text-purple-600 border-2 border-purple-200",
      pink: "bg-pink-100 text-pink-600 border-2 border-pink-200",
      indigo: "bg-indigo-100 text-indigo-600 border-2 border-indigo-200",
      slate: "bg-slate-200 text-slate-700 border-2 border-slate-300",
    },
  };

  const Container = animate ? motion.div : "div";
  const animationProps = animate
    ? {
        whileHover: { scale: 1.1, rotate: 5 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 300 },
      }
    : {};

  return (
    <Container
      className={`${sizeStyles[size]} rounded-2xl flex items-center justify-center ${colorStyles[variant][color]} ${className}`}
      {...animationProps}
    >
      <Icon className={iconSizes[size]} />
    </Container>
  );
};
