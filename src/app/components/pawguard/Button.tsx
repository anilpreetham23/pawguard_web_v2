"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";
import { cn } from "../ui/utils";
import "./pawguard-button.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "light";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-glow-primary active:scale-[0.95] active:shadow-sm active:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:shadow-none disabled:hover:bg-primary",
  secondary:
    "bg-foreground text-background shadow-sm hover:bg-primary hover:shadow-glow-primary active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:shadow-none disabled:hover:bg-foreground",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-primary/5 hover:border-primary hover:shadow-glow-soft active:scale-[0.96] active:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover hover:shadow-glow-destructive active:scale-[0.96] active:bg-destructive-active focus-visible:ring-2 focus-visible:ring-destructive/50 disabled:opacity-50 disabled:shadow-none disabled:hover:bg-destructive",
  light:
    "bg-white text-primary shadow-sm hover:bg-white/90 hover:shadow-lg active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50",
  ghost:
    "bg-transparent text-foreground hover:bg-primary/5 hover:shadow-glow-soft active:scale-[0.96] active:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-2",
  md: "h-12 px-6 text-xs gap-2.5",
  lg: "h-14 px-8 text-xs gap-3",
};

const loadingLabels: Record<string, string> = {
  emergency: "Contacting Nearest Unit...",
  adoption_detail: "Sending Request...",
  adoption_apply: "Submitting...",
  donate: "Processing Payment...",
  volunteer: "Submitting...",
  contact: "Sending...",
  newsletter: "Subscribing...",
  default: "Processing...",
};

const successLabels: Record<string, string> = {
  emergency: "✓ Rescue Team Dispatched",
  adoption_detail: "✓ Request Sent",
  adoption_apply: "✓ Application Received",
  donate: "✓ Donation Complete",
  volunteer: "✓ Welcome to PawGuard",
  contact: "✓ Message Sent",
  newsletter: "✓ Subscribed",
  default: "✓ Complete",
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSuccess?: boolean;
  context?: keyof typeof loadingLabels;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ComponentProps<"button">, keyof ButtonBaseProps> {
  asLink?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  asLink: { href: string };
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  isSuccess = false,
  context = "default",
  children,
  disabled,
  asLink,
  onClick,
  ...props
}: ButtonProps & { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  const label = isLoading
    ? loadingLabels[context]
    : isSuccess
      ? successLabels[context]
      : children;

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--ripple-x', `${x}px`);
    e.currentTarget.style.setProperty('--ripple-y', `${y}px`);
    
    onClick?.(e);
  }, [disabled, isLoading]);

  const classes = cn(
    "pawguard-btn font-condensed inline-flex items-center justify-center font-semibold tracking-wider uppercase rounded-btn outline-none cursor-pointer",
    "transition-all duration-gentle ease-gentle",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  const content = (
    <>
      {isLoading && (
        <svg className="size-4 shrink-0 animate-pulse-soft text-amber-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <ellipse cx="12" cy="17" rx="4.6" ry="3.8" opacity="0.85" />
          <circle cx="5.6" cy="10.6" r="2.1" opacity="0.7" />
          <circle cx="12" cy="9" r="2" opacity="0.7" />
          <circle cx="18.4" cy="10.6" r="2.1" opacity="0.7" />
        </svg>
      )}
      {isSuccess && !isLoading && (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      <span>{typeof label === "string" ? label : label}</span>
    </>
  );

  if (asLink) {
    return (
      <Link
        href={asLink.href}
        className={cn(
          "pawguard-btn font-condensed inline-flex items-center justify-center font-semibold tracking-wider uppercase rounded-btn outline-none cursor-pointer",
          "transition-all duration-gentle ease-gentle",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...(props as Omit<React.ComponentProps<typeof Link>, "href">)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        "pawguard-btn font-condensed inline-flex items-center justify-center font-semibold tracking-wider uppercase rounded-btn outline-none cursor-pointer",
        "transition-all duration-gentle ease-gentle",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
}