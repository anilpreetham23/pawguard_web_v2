"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../ui/utils";

interface InputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
  label?: string;
  error?: string;
  helper?: string;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  className,
  label,
  error,
  helper,
  prefix,
  id,
  type,
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed"
        >
          {label}
        </label>
      )}
      <div className="relative group w-full">
        {prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-gentle ease-gentle">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={cn(
            "w-full h-12 bg-input-background border border-border rounded-input px-4 text-foreground text-base placeholder:text-muted-foreground/60",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-gentle ease-gentle",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            !error && "focus:shadow-glow-soft",
            prefix && "pl-12",
            isPassword && "pr-12",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={`${inputId}-helper`} className="text-muted-foreground text-xs">
          {helper}
        </p>
      )}
    </div>
  );
});
