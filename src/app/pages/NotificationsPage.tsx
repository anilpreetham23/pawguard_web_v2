"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCheck, ChevronLeft, ChevronRight, Trash2, Bell, Inbox } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { PageShell, Section, Card, Reveal, Skeleton, EmptyState, Alert } from "../components/pawguard";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../providers/auth-provider";
import { getErrorMessage } from "@/lib/api";
import { getNotificationDestination } from "@/lib/notification-destination";

const PAGE_SIZE = 12;

function timeAgo(iso: string): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

const TYPE_EMOJI: Record<string, string> = {
  rescue: "🚨",
  emergency: "🚨",
  emergency_rescue: "🚨",
  lost_pet: "🐕",
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

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[92px] rounded-card bg-muted animate-pulse" />
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const { isAuthenticated, status, openAuthDialog } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    notifications,
    total,
    totalPages,
    unreadCount,
    isLoading,
    isError,
    error,
    refetch,
    markRead,
    markAllRead,
    deleteNotification,
  } = useNotifications(page, PAGE_SIZE);

  const isAllSelected =
    notifications.length > 0 &&
    notifications.every((n) => selectedIds.includes(n.id));

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n.id));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (
      !window.confirm(
        `Are you sure you want to delete ${count} selected notification${count === 1 ? "" : "s"}?`
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteNotification(id);
      }
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error("Failed to delete selected notifications:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDeleteAll() {
    if (notifications.length === 0) return;
    if (!window.confirm("Are you sure you want to delete all notifications on this page?")) {
      return;
    }
    setIsDeleting(true);
    try {
      for (const n of notifications) {
        await deleteNotification(n.id);
      }
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  if (status === "loading") {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader eyebrow="Notifications" title="Your Alerts" subtitle="Loading your notifications…" />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
            <ListSkeleton />
          </div>
        </main>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1">
          <PageHeader eyebrow="Notifications" title="Your Alerts" subtitle="Sign in to see adoption, rescue, appointment, and donation updates." />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-section-md lg:py-section-lg">
            <Reveal>
              <Card>
                <EmptyState
                  icon="message"
                  title="Sign in to view notifications"
                  description="Your alerts — application progress, rescue updates, appointment reminders, and more — will appear here once you're signed in."
                  action={{ label: "Sign in", onClick: () => openAuthDialog("sign-in") }}
                />
              </Card>
            </Reveal>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <PageHeader
          eyebrow="Notifications"
          title="Your Alerts"
          subtitle={unreadCount > 0 ? `You have ${unreadCount} unread update${unreadCount === 1 ? "" : "s"}.` : "You're all caught up."}
        />

        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-section-md lg:py-section-lg">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                {notifications.length > 0 && (
                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      aria-label="Select all notifications"
                    />
                    <span>Select All ({selectedIds.length} selected)</span>
                  </label>
                )}
                <p className="text-muted-foreground text-xs">
                  <span className="font-semibold text-foreground">{total}</span> notification{total === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="inline-flex items-center gap-1.5 bg-card border border-border text-foreground text-xs font-semibold px-3 py-2 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast"
                  >
                    <CheckCheck size={14} />
                    Mark All Read
                  </button>
                )}

                {selectedIds.length > 0 && (
                  <button
                    disabled={isDeleting}
                    onClick={handleDeleteSelected}
                    className="inline-flex items-center gap-1.5 bg-destructive text-destructive-foreground text-xs font-semibold px-3.5 py-2 rounded-btn hover:bg-destructive/90 transition-all duration-fast disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete Selected ({selectedIds.length})
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    disabled={isDeleting}
                    onClick={handleDeleteAll}
                    className="inline-flex items-center gap-1.5 bg-card border border-destructive/30 text-destructive text-xs font-semibold px-3.5 py-2 rounded-btn hover:bg-destructive/10 transition-all duration-fast disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete All
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <ListSkeleton />
            ) : isError ? (
              <Alert variant="error" title="Couldn't load notifications">
                {getErrorMessage(error)}{" "}
                <button onClick={() => refetch()} className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Retry
                </button>
              </Alert>
            ) : notifications.length === 0 ? (
              <Card>
                <EmptyState
                  icon="message"
                  customIcon={Inbox}
                  title="No notifications yet"
                  description="When you adopt, volunteer, or report a rescue, updates will land here."
                />
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((n) => {
                  const isSelected = selectedIds.includes(n.id);
                  return (
                    <Card
                      key={n.id}
                      className={
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : n.is_read
                          ? "bg-card"
                          : "border-primary/30 bg-primary/[0.04]"
                      }
                    >
                      <div className="flex items-start gap-3.5 p-5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(n.id)}
                          aria-label={`Select notification: ${n.title}`}
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                        />
                        <span aria-hidden="true" className="mt-0.5 text-xl leading-none shrink-0">
                          {emojiFor(n.notification_type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className={`text-sm font-semibold ${n.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                              {n.title}
                            </p>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                          </div>
                          {n.body && (
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{n.body}</p>
                          )}
                          {n.notification_type && (
                            <span className="mt-2 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                              {n.notification_type}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          {!n.is_read && (
                            <button
                              type="button"
                              onClick={() => markRead(n.id)}
                              aria-label="Mark as read"
                              className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-fast"
                            >
                              <CheckCheck size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteNotification(n.id)}
                            aria-label="Delete notification"
                            className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-fast"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {!isLoading && !isError && totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft size={15} />
                  Prev
                </button>
                <p className="text-muted-foreground text-sm">
                  Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
                </p>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-2 bg-card border border-border text-foreground text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-btn hover:border-primary hover:text-primary transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}