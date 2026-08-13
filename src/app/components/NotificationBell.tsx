"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useUnreadCount, useNotifications } from "../hooks/useNotifications";
import { useApiErrorMessage } from "@/lib/api";
import type { NotificationResponse } from "@/lib/api";
import { getNotificationDestination } from "@/lib/notification-destination";
import { cn } from "./ui/utils";

/** Human-friendly relative time for the bell dropdown (e.g. "2h ago"). */
function timeAgo(iso: string): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const TYPE_EMOJI: Record<string, string> = {
  rescue: "🚨",
  adoption: "🐶",
  appointment: "📅",
  reminder: "⏰",
  donation: "❤️",
  foster: "🏠",
  volunteer: "🤝",
  system: "⚙️",
  broadcast: "📢",
};

function emojiFor(type: string | null): string {
  if (!type) return "🔔";
  return TYPE_EMOJI[type.toLowerCase()] ?? "🔔";
}

/**
 * Notification bell for the signed-in navbar: an unread-count badge plus a
 * dropdown of the latest notifications. Clicking an item marks it read and
 * navigates to its action target; "View all" goes to the notifications page.
 */
export function NotificationBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const unreadCount = useUnreadCount();
  const {
    notifications,
    isLoading,
    isError,
    error,
    refetch,
    markRead,
    markAllRead,
    deleteNotification,
  } = useNotifications(1, 6);
  const errorMessage = useApiErrorMessage(error);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
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

  const handleItemClick = async (n: NotificationResponse) => {
    if (!n.is_read) {
      try {
        await markRead(n.id);
      } catch {
        // non-fatal — still navigate
      }
    }
    setOpen(false);
    router.push(getNotificationDestination(n));
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "relative inline-flex h-9 min-w-[44px] items-center justify-center rounded-full text-muted-foreground transition-colors duration-fast",
          "hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60",
          open && "bg-primary/5 text-primary",
        )}
      >
        <Bell size={16} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute top-0.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center leading-none"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        <span className="sr-only" aria-live="polite">
          {unreadCount > 0 ? `${unreadCount} unread notifications` : "No unread notifications"}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Notifications"
          className="absolute right-0 mt-2 w-[min(90vw,360px)] origin-top-right rounded-card border border-border bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
            <p className="text-xs font-bold tracking-wider uppercase text-foreground">Notifications</p>
            {notifications.some((n) => !n.is_read) && (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <CheckCheck size={13} aria-hidden="true" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col gap-3 p-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-card bg-muted animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="p-5 text-center">
                <p className="text-sm text-muted-foreground">{errorMessage ?? "Couldn't load notifications."}</p>
                <button type="button" onClick={() => refetch()} className="mt-2 text-xs font-semibold text-primary hover:underline">
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                You're all caught up.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((n) => (
                  <li key={n.id} className="relative">
                    {n.action_url ? (
                      <button
                        type="button"
                        onClick={() => handleItemClick(n)}
                        className={cn(
                          "w-full text-left flex items-start gap-3 px-4 py-3 transition-colors duration-fast",
                          n.is_read ? "hover:bg-muted/60" : "bg-primary/[0.04] hover:bg-primary/[0.08]",
                        )}
                      >
                        <span aria-hidden="true" className="mt-0.5 text-base leading-none">{emojiFor(n.notification_type)}</span>
                        <span className="flex-1 min-w-0">
                          <span className={cn("block text-sm leading-snug", n.is_read ? "text-muted-foreground font-medium" : "text-foreground font-semibold")}>
                            {n.title}
                          </span>
                          {!n.is_read && (
                            <span aria-hidden="true" className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground pt-1">{timeAgo(n.created_at)}</span>
                      </button>
                    ) : (
                      <div className={cn(
                        "w-full text-left flex items-start gap-3 px-4 py-3",
                        n.is_read ? "" : "bg-primary/[0.04]",
                      )}>
                        <span aria-hidden="true" className="mt-0.5 text-base leading-none">{emojiFor(n.notification_type)}</span>
                        <span className="flex-1 min-w-0">
                          <span className={cn("block text-sm leading-snug", n.is_read ? "text-muted-foreground font-medium" : "text-foreground font-semibold")}>
                            {n.title}
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5">{n.body}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteNotification(n.id)}
                          aria-label="Delete notification"
                          className="shrink-0 p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-fast"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-border">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-bold tracking-wider uppercase font-condensed text-primary hover:underline py-1"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}