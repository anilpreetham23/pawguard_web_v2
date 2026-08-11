"use client";

import type { LucideIcon } from "lucide-react";
import { Search, Heart, MessageSquare, Users } from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "./Button";
import Link from "next/link";

type EmptyStateIcon = "search" | "heart" | "message" | "users" | "custom";

interface EmptyStateAction {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: EmptyStateIcon;
  customIcon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  badge?: boolean;
  className?: string;
}

const iconMap: Record<EmptyStateIcon, LucideIcon> = {
  search: Search,
  heart: Heart,
  message: MessageSquare,
  users: Users,
  custom: Search,
};

export function EmptyState({
  icon = "search",
  customIcon: CustomIcon,
  title,
  description,
  action,
  badge = true,
  className,
}: EmptyStateProps) {
  const Icon = CustomIcon ?? iconMap[icon];

  return (
    <div className={cn("flex flex-col items-center gap-5 py-16 text-center", className)}>
      <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center relative">
        <Icon size={36} className="text-muted-foreground" strokeWidth={1.2} />
        {badge && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="text-primary">
              <path d="M10 1C7.5 1 5.5 3 5.5 5.5C5.5 6.8 6.1 7.9 7 8.6C5.2 9.3 4 11 4 13C4 15.8 6.2 18 9 18H11C13.8 18 16 15.8 16 13C16 11 14.8 9.3 13 8.6C13.9 7.9 14.5 6.8 14.5 5.5C14.5 3 12.5 1 10 1Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-foreground font-semibold text-lg">{title}</p>
        {description && (
          <p className="text-muted-foreground text-sm max-w-[320px]">{description}</p>
        )}
      </div>
      {action && (
        action.to ? (
          <Link
            href={action.to}
            className="bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase font-condensed px-6 py-3 rounded-btn hover:bg-primary-hover transition-all duration-fast self-center mt-1"
          >
            {action.label}
          </Link>
        ) : (
          <Button variant="primary" size="md" onClick={action.onClick} className="self-center mt-1">
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
