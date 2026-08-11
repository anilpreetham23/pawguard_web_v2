"use client";

import { CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "./Button";
import Link from "next/link";

interface SuccessAction {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface SuccessStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  impact?: { label: string; value: string };
  action?: SuccessAction;
  secondaryAction?: SuccessAction;
  className?: string;
}

export function SuccessState({
  icon: Icon = CheckCircle2,
  title,
  description,
  impact,
  action,
  secondaryAction,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-card p-6 lg:p-8 shadow-lg flex flex-col gap-5 animate-celebration-pop",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
        <Icon size={28} className="text-primary-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-foreground font-bold text-2xl">{title}</h2>
        <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
      </div>

      {impact && (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4">
          <span className="font-serif text-primary font-bold text-3xl">{impact.value}</span>
          <div className="flex flex-col">
            <span className="text-foreground font-semibold text-sm">Your impact</span>
            <span className="text-muted-foreground text-sm leading-relaxed">{impact.label}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        {action && (
          action.to ? (
            <Link
              href={action.to}
              className="bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase font-condensed px-6 py-3 rounded-btn hover:bg-primary-hover transition-all duration-fast"
            >
              {action.label}
            </Link>
          ) : (
            <Button variant="primary" size="md" onClick={action.onClick}>
              {action.label}
            </Button>
          )
        )}
        {secondaryAction && (
          secondaryAction.to ? (
            <Link
              href={secondaryAction.to}
              className="border border-border text-foreground font-semibold text-xs tracking-wider uppercase font-condensed px-6 py-3 rounded-btn hover:bg-secondary transition-all duration-fast"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <Button variant="outline" size="md" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
