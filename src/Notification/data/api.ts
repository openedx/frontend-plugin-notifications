import { getAuthenticatedHttpClient, getSiteConfig, snakeCaseObject } from '@openedx/frontend-base';

export interface NotificationCountsResponse {
  count: number,
  count_by_app_name: Record<string, number>,
  show_notifications_tray: boolean,
  notification_expiry_days?: number,
  is_new_notification_view_enabled: boolean,
}

export interface NotificationRaw {
  id: number,
  notification_type?: string,
  content_url: string,
  content: string,
  content_context?: { course_name?: string },
  created: string,
  last_read?: string | null,
  last_seen?: string | null,
}

export interface NotificationsListResponse {
  next: string | null,
  previous: string | null,
  count: number,
  num_pages: number,
  current_page: number,
  start: number,
  results: NotificationRaw[],
}

export interface MarkNotificationResponse {
  message?: string,
}

export const getNotificationsCountApiUrl = (): string => `${getSiteConfig().lmsBaseUrl}/api/notifications/count/`;
export const getNotificationsListApiUrl = (): string => `${getSiteConfig().lmsBaseUrl}/api/notifications/`;
export const markNotificationsSeenApiUrl = (appName: string): string => `${getSiteConfig().lmsBaseUrl}/api/notifications/mark-seen/${appName}/`;
export const markNotificationAsReadApiUrl = (): string => `${getSiteConfig().lmsBaseUrl}/api/notifications/read/`;

export async function getNotificationsList(
  appName: string,
  page: number,
  pageSize = 10,
  trayOpened = true,
): Promise<NotificationsListResponse> {
  const params = snakeCaseObject({
    appName, page, pageSize, trayOpened,
  });
  const { data } = await getAuthenticatedHttpClient().get(getNotificationsListApiUrl(), { params });
  return data;
}

export async function getNotificationCounts(): Promise<NotificationCountsResponse> {
  const { data } = await getAuthenticatedHttpClient().get(getNotificationsCountApiUrl());
  return data;
}

export async function markNotificationSeen(appName: string): Promise<MarkNotificationResponse> {
  const { data } = await getAuthenticatedHttpClient().put(`${markNotificationsSeenApiUrl(appName)}`);
  return data;
}

export async function markAllNotificationRead(appName: string): Promise<MarkNotificationResponse> {
  const params = snakeCaseObject({ appName });
  const { data } = await getAuthenticatedHttpClient().patch(markNotificationAsReadApiUrl(), params);
  return data;
}

export async function markNotificationRead(
  notificationId: number,
): Promise<{ data: MarkNotificationResponse, id: number }> {
  const params = snakeCaseObject({ notificationId });
  const { data } = await getAuthenticatedHttpClient().patch(markNotificationAsReadApiUrl(), params);
  return { data, id: notificationId };
}
