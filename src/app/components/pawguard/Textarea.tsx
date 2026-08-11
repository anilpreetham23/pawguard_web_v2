"use client";

import { forwardRef } from "react";
import { cn } from "../ui/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  className,
  label,
  error,
  id,
  maxLength,
  value,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        value={value}
        maxLength={maxLength}
        className={cn(
          "w-full min-h-[120px] bg-input-background border border-border rounded-input px-4 py-4 text-foreground text-base placeholder:text-muted-foreground/60 resize-none",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          "transition-all duration-gentle ease-gentle",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",
          error && "border-destructive focus:border-destructive focus:ring-destructive/20",
          !error && "focus:shadow-glow-soft",
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          {error && (
            <p id={`${inputId}-error`} className="text-destructive text-xs" role="alert">
              {error}
            </p>
          )}
        </div>
        {maxLength && (
          <span className={cn(
            "text-xs font-medium tabular-nums shrink-0",
            charCount > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground",
          )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});
