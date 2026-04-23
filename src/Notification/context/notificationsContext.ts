import React from 'react';

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
  appName: string,
  handleActiveTab: (selectedAppName: string) => void,
}

export const initialState: NotificationContextValue = {
  appName: 'discussion',
  handleActiveTab: () => {},
};

export const notificationsContext = React.createContext<NotificationContextValue>(initialState);
