import React, { forwardRef } from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  hint?: string;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

const labelClass = "text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 block mb-2";
const errorClass = "text-xs font-medium text-danger-500 mt-1.5";
const hintClass = "text-xs text-surface-400 dark:text-surface-500 mt-1.5";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, trailingAction, hint, id, className = "", ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label htmlFor={fieldId} className={labelClass}>{label}</label>
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            {...rest}
            className={[
              "input-field",
              icon ? "pl-11" : "",
              trailingAction ? "pr-11" : "",
              error ? "border-danger-400 focus:ring-danger-400/40 focus:border-danger-500" : "",
              className,
            ].join(" ")}
          />
          {trailingAction && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailingAction}</span>
          )}
        </div>
        {hint && !error && <p className={hintClass}>{hint}</p>}
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, id, className = "", ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label htmlFor={fieldId} className={labelClass}>{label}</label>
        <textarea
          ref={ref}
          id={fieldId}
          {...rest}
          className={[
            "input-field resize-none",
            error ? "border-danger-400 focus:ring-danger-400/40 focus:border-danger-500" : "",
            className,
          ].join(" ")}
        />
        {hint && !error && <p className={hintClass}>{hint}</p>}
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
