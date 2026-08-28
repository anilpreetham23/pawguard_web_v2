"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, FileText, LogIn, LogOut, PawPrint, User } from "lucide-react";
import { getAvatarUrl } from "@/lib/api";
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

function MenuLink({
  href,
  icon,
  label,
  desc,
  badge = 0,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc?: string;
  badge?: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-foreground hover:bg-secondary/60 transition-colors duration-fast"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight">{label}</span>
        {desc && (
          <span className="block text-xs text-muted-foreground truncate">{desc}</span>
        )}
      </span>
      {badge > 0 && (
        <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-bold leading-none">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

/** Desktop: a compact sign-in button or a signed-in user account menu. */
export function AuthNavControls({ className }: { className?: string }) {
  const { user, status, openAuthDialog, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadCount = useUnreadCount();

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (status === "loading") {
    return <div className="h-9 w-20 rounded-full bg-muted animate-pulse" aria-hidden="true" />;
  }

  if (user) {
    const avatarSrc = getAvatarUrl(user);
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <NotificationBell />
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open account menu"
            aria-haspopup="menu"
            aria-expanded={open}
            title={user.email}
            className="flex items-center gap-2 rounded-full border border-border bg-background/70 pl-1 pr-2 py-1 hover:border-primary/40 transition-colors duration-fast"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                initials(user.full_name) || "U"
              )}
            </span>
            <span className="hidden lg:block text-xs font-semibold text-foreground max-w-[120px] truncate">
              {user.full_name}
            </span>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={cn(
                "text-muted-foreground transition-transform duration-fast",
                open && "rotate-180",
              )}
            />
          </button>

          {open && (
            <div
              role="menu"
              aria-label="Account"
              className="absolute right-0 top-full mt-2 w-64 rounded-card border border-border bg-card shadow-lg p-1.5 z-[var(--z-modal)]"
            >
              <MenuLink
                href="/account"
                icon={<User size={16} />}
                label="My Account"
                desc="Profile & saved dogs"
                onNavigate={() => setOpen(false)}
              />
              <MenuLink
                href="/account/pets"
                icon={<PawPrint size={16} />}
                label="My Pets"
                desc="My Pets"
                onNavigate={() => setOpen(false)}
              />
              <MenuLink
                href="/applications"
                icon={<FileText size={16} />}
                label="My Applications"
                desc="Track adoption status"
                onNavigate={() => setOpen(false)}
              />
              <MenuLink
                href="/notifications"
                icon={<Bell size={16} />}
                label="Notifications"
                desc={unreadCount > 0 ? `${unreadCount} unread` : "No new alerts"}
                badge={unreadCount}
                onNavigate={() => setOpen(false)}
              />
              <div className="my-1 h-px bg-border" role="separator" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-fast"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">
                  {initials(user.full_name) || "U"}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-semibold leading-tight">Sign Out</span>
                </span>
                <LogOut size={16} className="text-muted-foreground" />
              </button>
            </div>
          )}
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
          href="/account/pets"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 rounded-card px-4 py-3 text-foreground hover:bg-secondary/60 transition-colors duration-fast text-base font-semibold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PawPrint size={18} />
          </span>
          <span className="flex-1 text-left truncate">
            <span className="block">My Pets</span>
            <span className="block text-xs text-muted-foreground font-normal truncate">Your adopted pets</span>
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