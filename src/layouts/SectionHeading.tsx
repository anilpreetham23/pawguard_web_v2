"use client";

import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowClassName?: string;
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  eyebrowClassName = "",
  as: Tag = "h2",
  children,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-[var(--space-3)] ${align === "center" ? "items-center text-center" : ""} ${className}`}>
      {eyebrow && (
        <p className={`text-primary text-xs font-semibold tracking-[0.12em] uppercase ${eyebrowClassName}`}>
          {eyebrow}
        </p>
      )}
      <Tag className="text-foreground font-serif font-bold text-2xl lg:text-3xl leading-tight tracking-tight">
        {children}
      </Tag>
      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed max-w-[540px]">
          {description}
        </p>
      )}
    </div>
  );
}
