/**
 * Notifications feature service.
 *
 * Feature-level API calls for the notifications module. Request/response
 * shapes are derived from the backend OpenAPI contract:
 *   https://pawguard-backend-mqri.onrender.com/redoc
 *
 * All notification endpoints are authenticated — the list, read-state, and
 * preference calls are scoped to the current user. The ingelligent HTTP
 * client attaches the bearer token automatically, so callers should handle
 * `401` (signed out) gracefully.
 */

import {
  API_ROUTES,
  QUERY_KEYS,
  apiDelete,
  apiGet,
  apiGetPage,
  apiPut,
  type NotificationPreferenceResponse,
  type NotificationPreferenceUpdate,
  type NotificationResponse,
  type Page,
  type QueryParams,
  type UnreadCountResponse,
} from "@/lib/api";

/** Query params accepted by `GET /notifications`. */
export interface NotificationQueryParams extends QueryParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
  notification_type?: string;
  is_read?: boolean;
}

export const notificationsService = {
  /**
   * `GET /notifications` — the current user's notifications, paginated.
   * Returns a `Page<NotificationResponse>` with `items` and `meta`.
   */
  getNotifications(
    params?: NotificationQueryParams
  ): Promise<Page<NotificationResponse>> {
    return apiGetPage<NotificationResponse>(
      API_ROUTES.notifications.list,
      params
    );
  },

  /** `GET /notifications/unread-count` — the current user's unread count. */
  getUnreadCount(): Promise<UnreadCountResponse> {
    return apiGet<UnreadCountResponse>(API_ROUTES.notifications.unreadCount);
  },

  /** `PUT /notifications/{id}/read` — mark a single notification as read. */
  markRead(notificationId: string): Promise<NotificationResponse> {
    return apiPut<NotificationResponse>(
      API_ROUTES.notifications.markRead(notificationId)
    );
  },

  /** `PUT /notifications/read-all` — mark all notifications as read. */
  markAllRead(): Promise<null> {
    return apiPut<null>(API_ROUTES.notifications.markAllRead);
  },

  /** `DELETE /notifications/{id}` — delete a single notification. */
  deleteNotification(notificationId: string): Promise<null> {
    return apiDelete<null>(
      API_ROUTES.notifications.notification(notificationId)
    );
  },

  /** `GET /notifications/preferences` — the current user's preferences. */
  getPreferences(): Promise<NotificationPreferenceResponse> {
    return apiGet<NotificationPreferenceResponse>(
      API_ROUTES.notifications.preferences
    );
  },

  /** `PUT /notifications/preferences` — update the current user's preferences. */
  updatePreferences(
    body: NotificationPreferenceUpdate
  ): Promise<NotificationPreferenceResponse> {
    return apiPut<NotificationPreferenceResponse>(
      API_ROUTES.notifications.preferences,
      body
    );
  },
};

export { QUERY_KEYS };

export type {
  NotificationPreferenceResponse,
  NotificationPreferenceUpdate,
  NotificationResponse,
  Page,
  UnreadCountResponse,
};