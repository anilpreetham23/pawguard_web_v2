"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell, FileText, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../providers/auth-provider";
import { useUnreadCount } from "../hooks/useNotifications";
import { NotificationBell } from "./NotificationBell";
import { cn } from "./ui/utils";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Desktop: a compact sign-in button or a user chip with sign-out. */
export function AuthNavControls({ className }: { className?: string }) {
  const { user, status, openAuthDialog, signOut } = useAuth();

  if (status === "loading") {
    return <div className="h-9 w-20 rounded-full bg-muted animate-pulse" aria-hidden="true" />;
  }

  if (user) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <NotificationBell />
        <div
          className="flex items-center gap-2 rounded-full border border-border bg-background/70 pl-1 pr-3 py-1"
          title={user.email}
        >
          <Link
            href="/account"
            className="flex items-center gap-2 rounded-full"
            aria-label="Go to your account"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase">
              {initials(user.full_name) || "U"}
            </span>
            <span className="hidden lg:block text-xs font-semibold text-foreground max-w-[120px] truncate">
              {user.full_name}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-fast"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openAuthDialog("sign-in")}
      className={cn(
        "inline-flex items-center gap-2 h-9 px-4 rounded-full text-xs font-semibold uppercase tracking-wider font-condensed border border-border bg-background/70 text-foreground",
        "hover:bg-primary/5 hover:border-primary hover:text-primary active:scale-[0.97] transition-all duration-fast",
        className,
      )}
    >
      <LogIn size={14} />
      Sign in
    </button>
  );
}

/** Mobile: full-width sign-in/sign-out row shown in the mobile panel. */
export function AuthMobileControls({ onNavigate }: { onNavigate?: () => void }) {
  const { user, status, openAuthDialog, signOut } = useAuth();
  const unreadCount = useUnreadCount();

  if (status === "loading") {
    return <div className="h-12 rounded-card bg-muted animate-pulse" aria-hidden="true" />;
  }

  if (user) {
    return (
      <div className="flex flex-col">
        <Link
          href="/notifications"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 rounded-card px-4 py-3 text-foreground hover:bg-secondary/60 transition-colors duration-fast text-base font-semibold"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center leading-none"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            <span className="sr-only" aria-live="polite">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "No unread notifications"}
            </span>
          </span>
          <span className="flex-1 text-left truncate">
            <span className="block">Notifications</span>
            <span className="block text-xs text-muted-foreground font-normal truncate">
              {unreadCount > 0 ? `${unreadCount} unread` : "No new alerts"}
            </span>
          </span>
        </Link>
        <Link
          href="/applications"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 rounded-card px-4 py-3 text-foreground hover:bg-secondary/60 transition-colors duration-fast text-base font-semibold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText size={18} />
          </span>
          <span className="flex-1 text-left truncate">
            <span className="block">My Applications</span>
            <span className="block text-xs text-muted-foreground font-normal truncate">Track adoption status</span>
          </span>
        </Link>
        <Link
          href="/account"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 rounded-card px-4 py-3 text-foreground hover:bg-secondary/60 transition-colors duration-fast text-base font-semibold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User size={18} />
          </span>
          <span className="flex-1 text-left truncate">
            <span className="block">My Account</span>
            <span className="block text-xs text-muted-foreground font-normal truncate">Profile &amp; saved dogs</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            onNavigate?.();
          }}
          className="flex items-center gap-3 rounded-card px-4 py-3 text-foreground hover:bg-secondary/60 transition-colors duration-fast text-base font-semibold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase">
            {initials(user.full_name) || "U"}
          </span>
          <span className="flex-1 text-left truncate">
            <span className="block">{user.full_name}</span>
            <span className="block text-xs text-muted-foreground font-normal truncate">{user.email}</span>
          </span>
          <LogOut size={18} className="text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        openAuthDialog("sign-in");
        onNavigate?.();
      }}
      className="flex items-center gap-3 rounded-card px-4 py-3 text-foreground hover:bg-secondary/60 transition-colors duration-fast text-base font-semibold"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <User size={18} />
      </span>
      Sign in / Create account
    </button>
  );
}