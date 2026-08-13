"use client";

import {
  QUERY_KEYS,
  useApiMutation,
  useApiQuery,
} from "@/lib/api";
import { notificationsService } from "@/services/api/notifications";
import type { NotificationResponse } from "@/lib/api";
import { queryClient } from "@/lib/react-query";
import { useAuth } from "../providers/auth-provider";

function invalidateNotifications() {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.list });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
}

export interface NotificationsResult {
  notifications: NotificationResponse[];
  total: number;
  totalPages: number;
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

/**
 * The signed-in user's notification center: list + unread badge, plus the
 * mark-read / mark-all / delete actions. Everything is gated on an active
 * session — signed-out visitors get an empty, disabled result.
 */
export function useNotifications(page = 1, pageSize = 20): NotificationsResult {
  const { isAuthenticated, status } = useAuth();
  const enabled = isAuthenticated && status === "authenticated";

  const list = useApiQuery({
    queryKey: [QUERY_KEYS.notifications.list, page, pageSize],
    enabled,
    queryFn: () =>
      notificationsService.getNotifications({ page, page_size: pageSize }),
  });

  const unread = useApiQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    enabled,
    queryFn: () => notificationsService.getUnreadCount(),
  });

  const markReadMutation = useApiMutation<NotificationResponse, string>({
    mutationFn: (id) => notificationsService.markRead(id),
    onSuccess: () => invalidateNotifications(),
  });

  const markAllReadMutation = useApiMutation<null, void>({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => invalidateNotifications(),
  });

  const deleteMutation = useApiMutation<null, string>({
    mutationFn: (id) => notificationsService.deleteNotification(id),
    onSuccess: () => invalidateNotifications(),
  });

  return {
    notifications: list.data?.items ?? [],
    total: list.data?.meta.total ?? 0,
    totalPages: list.data?.meta.total_pages ?? 0,
    unreadCount: unread.data?.count ?? 0,
    isLoading: list.isLoading || unread.isLoading,
    isError: list.isError || unread.isError,
    error: list.error ?? unread.error,
    refetch: () => {
      void list.refetch();
      void unread.refetch();
    },
    markRead: async (id) => {
      await markReadMutation.mutateAsync(id);
    },
    markAllRead: async () => {
      await markAllReadMutation.mutateAsync();
    },
    deleteNotification: async (id) => {
      await deleteMutation.mutateAsync(id);
    },
  };
}

/**
 * Lightweight unread-count hook for the navbar bell badge. Polls the
 * `unread-count` endpoint on an interval so the badge stays live without
 * re-fetching the whole list.
 */
export function useUnreadCount(refreshMs = 60_000): number {
  const { isAuthenticated, status } = useAuth();
  const enabled = isAuthenticated && status === "authenticated";

  const unread = useApiQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    enabled,
    refetchInterval: enabled ? refreshMs : false,
    queryFn: () => notificationsService.getUnreadCount(),
  });

  return unread.data?.count ?? 0;
}
