"use client";

import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  variant?: "default" | "border-accent" | "dark";
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  variant = "default",
  right,
  children,
  className = "",
}: PageHeaderProps) {
  const isDark = variant === "dark";
  const borderClass = variant === "border-accent" ? "border-l-4 border-primary pl-6" : "";

  return (
    <section
      className={`${
        isDark ? "bg-section-dark noise-overlay" : "bg-background"
      } border-b border-border pt-[calc(var(--header-height)+1rem)] lg:pt-[calc(var(--header-height)+2rem)] pb-section-md lg:pb-section-lg px-6 lg:px-8 ${className}`}
    >
      <div className={`max-w-[1280px] mx-auto ${right ? "grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-12)] lg:gap-[var(--space-20)] items-center" : ""}`}>
        <div className={`flex flex-col gap-6 ${borderClass}`}>
          <p
            className={`text-xs font-semibold tracking-widest uppercase ${
              isDark ? "text-background/60" : "text-primary"
            }`}
          >
            {eyebrow}
          </p>
          <h1
            className={`font-serif font-bold text-4xl lg:text-5xl leading-tight tracking-tight ${
              isDark ? "text-background" : "text-foreground"
            } max-w-[580px]`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-lg leading-relaxed max-w-[480px] ${
                isDark ? "text-background/70" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {right && <div className="relative">{right}</div>}
      </div>
    </section>
  );
}
