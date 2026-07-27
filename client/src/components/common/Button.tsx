import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient" | "solid";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-bold
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-offset-2
    dark:focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
    touch-manipulation
  `;

  const variantStyles = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700
      focus:ring-primary-200 dark:focus:ring-primary-900
      shadow-elevation-2 hover:shadow-elevation-3 dark:shadow-lg dark:hover:shadow-xl
      transition-colors
    `,
    gradient: `
      bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600
      dark:from-primary-500 dark:via-secondary-500 dark:to-primary-500
      bg-size-200 bg-pos-0 hover:bg-pos-100
      text-white
      focus:ring-primary-200 dark:focus:ring-primary-900
      shadow-elevation-2 hover:shadow-elevation-3 dark:shadow-lg dark:hover:shadow-xl
      transition-colors
    `,
    solid: `
      glass-sm text-slate-900 dark:text-white
      hover:bg-white/80 hover:dark:bg-slate-700/80
      focus:ring-slate-200 dark:focus:ring-slate-700
      shadow-md hover:shadow-lg dark:shadow-md dark:hover:shadow-lg
      transition-all
    `,
    secondary: `
      bg-secondary-600 text-white
      hover:bg-secondary-700
      focus:ring-secondary-200 dark:focus:ring-secondary-900
      shadow-elevation-2 hover:shadow-elevation-3 dark:shadow-lg dark:hover:shadow-xl
      transition-colors
    `,
    outline: `
      glass-sm text-slate-700 dark:text-slate-200
      hover:bg-white/80 dark:hover:bg-slate-800/80
      focus:ring-slate-200 dark:focus:ring-slate-700
      shadow-sm hover:shadow-md dark:shadow-sm dark:hover:shadow-md
      transition-all
    `,
    ghost: `
      bg-transparent text-slate-700
      dark:text-slate-300
      hover:glass
      dark:hover:glass
      focus:ring-slate-200 dark:focus:ring-slate-700
      transition-all
    `,
    danger: `
      bg-error-600 text-white
      hover:bg-error-700
      focus:ring-error-200 dark:focus:ring-error-900
      shadow-elevation-2 hover:shadow-elevation-3 dark:shadow-lg dark:hover:shadow-xl
      transition-colors
    `,
  };

  const sizeStyles = {
    sm: `px-4 py-2.5 text-sm rounded-xl gap-2 min-h-[44px]`,
    md: `px-5 py-3 text-base rounded-xl gap-2 min-h-[48px]`,
    lg: `px-6 py-3.5 text-lg rounded-2xl gap-3 min-h-[52px]`,
    xl: `px-8 py-4 text-xl rounded-2xl gap-3 min-h-[56px]`,
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -2 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      <span className="relative flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </span>
    </motion.button>
  );
};
