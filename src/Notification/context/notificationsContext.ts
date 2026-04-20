import React from 'react';
import { RequestStatus } from '../data/constants';

export interface Pagination {
  numPages?: number,
  currentPage?: number,
  hasMorePages?: boolean,
}

export interface TabsCount {
  count: number,
  [appId: string]: number,
}

export interface NotificationItem {
  id: number,
  notificationType?: string,
  contentUrl: string,
  content: string,
  contentContext?: { courseName?: string },
  created: string,
  lastRead?: string | null,
  lastSeen?: string | null,
  [key: string]: unknown,
}

export interface Tour {
  id: number,
  tourName: string,
  enabled?: boolean,
  showTour?: boolean,
}

export interface NotificationContextValue {
  notificationStatus: string,
  notificationListStatus: string,
  appName: string,
  appsId: string[],
  apps: Record<string, string[]>,
  notifications: Record<string, NotificationItem>,
  tabsCount: TabsCount,
  showNotificationsTray: boolean,
  pagination: Pagination,
  trayOpened: boolean,
  notificationExpiryDays?: number,
  isNewNotificationViewEnabled?: boolean,
  enableNotificationTray?: boolean,
  tours?: Tour[],
  handleActiveTab: (selectedAppName: string) => void,
  updateNotificationData: (data: Partial<NotificationContextValue>) => void,
}

export const initialState: NotificationContextValue = {
  notificationStatus: RequestStatus.IDLE,
  notificationListStatus: RequestStatus.IDLE,
  appName: 'discussion',
  appsId: [],
  apps: {},
  notifications: {},
  tabsCount: { count: 0 },
  showNotificationsTray: false,
  pagination: {},
  trayOpened: false,
  handleActiveTab: () => {},
  updateNotificationData: () => {},
};

export const notificationsContext = React.createContext<NotificationContextValue>(initialState);
