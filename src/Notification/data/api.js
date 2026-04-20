import { getAuthenticatedHttpClient, getSiteConfig, snakeCaseObject } from '@openedx/frontend-base';

export const getNotificationsCountApiUrl = () => `${getSiteConfig().lmsBaseUrl}/api/notifications/count/`;
export const getNotificationsListApiUrl = () => `${getSiteConfig().lmsBaseUrl}/api/notifications/`;
export const markNotificationsSeenApiUrl = (appName) => `${getSiteConfig().lmsBaseUrl}/api/notifications/mark-seen/${appName}/`;
export const markNotificationAsReadApiUrl = () => `${getSiteConfig().lmsBaseUrl}/api/notifications/read/`;

export async function getNotificationsList(appName, page, pageSize, trayOpened) {
  const params = snakeCaseObject({
    appName, page, pageSize, trayOpened,
  });
  const { data } = await getAuthenticatedHttpClient().get(getNotificationsListApiUrl(), { params });
  return data;
}

export async function getNotificationCounts() {
  const { data } = await getAuthenticatedHttpClient().get(getNotificationsCountApiUrl());
  return data;
}

export async function markNotificationSeen(appName) {
  const { data } = await getAuthenticatedHttpClient().put(`${markNotificationsSeenApiUrl(appName)}`);
  return data;
}

export async function markAllNotificationRead(appName) {
  const params = snakeCaseObject({ appName });
  const { data } = await getAuthenticatedHttpClient().patch(markNotificationAsReadApiUrl(), params);
  return data;
}

export async function markNotificationRead(notificationId) {
  const params = snakeCaseObject({ notificationId });
  const { data } = await getAuthenticatedHttpClient().patch(markNotificationAsReadApiUrl(), params);
  return { data, id: notificationId };
}
