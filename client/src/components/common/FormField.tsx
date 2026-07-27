import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select";
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  options?: { value: string; label: string }[];
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  error,
  register,
  options,
  helperText,
  required,
  icon,
  rows = 4,
}) => {
  const baseInputStyles =
    "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none font-medium min-h-[48px] touch-manipulation backdrop-blur-lg";
  const normalStyles =
    "glass border-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";
  const errorStyles =
    "glass border-2 border-danger-500 dark:border-danger-600 text-slate-900 dark:text-white focus:border-danger-600 dark:focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10";

  const inputStyles = error
    ? `${baseInputStyles} ${errorStyles}`
    : `${baseInputStyles} ${normalStyles}`;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-semibold text-neutral-700 dark:text-slate-300">
        {label}
        {required && <span className="text-danger-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}

        {type === "textarea" ? (
          <textarea
            id={name}
            placeholder={placeholder}
            rows={rows}
            className={`${inputStyles} ${icon ? "pl-11" : ""} resize-none min-h-[120px]`}
            {...register}
          />
        ) : type === "select" && options ? (
          <select
            id={name}
            className={`${inputStyles} ${icon ? "pl-11" : ""} cursor-pointer`}
            {...register}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className={`${inputStyles} ${icon ? "pl-11" : ""}`}
            {...register}
          />
        )}
      </div>

      {/* Helper Text or Error */}
      {error ? (
        <div className="flex items-center gap-2 text-danger-600 dark:text-danger-400">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : helperText ? (
        <p className="text-sm text-neutral-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
