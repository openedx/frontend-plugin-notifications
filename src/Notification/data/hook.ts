import {
  useContext, useCallback, useEffect, useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { camelCaseObject, useAuthenticatedUser } from '@openedx/frontend-base';

import { breakpoints, useWindowSize } from '@openedx/paragon';
import { RequestStatus } from './constants';
import {
  notificationsContext,
  NotificationContextValue,
  NotificationItem,
  TabsCount,
  Pagination,
} from '../context/notificationsContext';
import {
  getNotificationsList, getNotificationCounts, markNotificationSeen, markAllNotificationRead, markNotificationRead,
} from './api';

export interface NotificationAppData {
  tabsCount: TabsCount,
  appsId: string[],
  apps: Record<string, string[]>,
  showNotificationsTray: boolean,
  notificationStatus: string,
  notificationExpiryDays: number,
  isNewNotificationViewEnabled: boolean,
}

export function useIsOnMediumScreen(): boolean {
  const windowSize = useWindowSize();
  const width = windowSize.width ?? 0;
  const largeMax = breakpoints.large?.maxWidth ?? Infinity;
  const mediumMin = breakpoints.medium?.minWidth ?? 0;
  return largeMax > width && width >= mediumMin;
}

export function useIsOnLargeScreen(): boolean {
  const windowSize = useWindowSize();
  const width = windowSize.width ?? 0;
  const xlMin = breakpoints.extraLarge?.minWidth ?? Infinity;
  return width >= xlMin;
}

export function useNotification() {
  const ctx = useContext(notificationsContext);
  const {
    appName, apps, tabsCount, notifications, updateNotificationData,
  } = ctx;

  interface CamelCaseCountsResponse {
    count: number,
    countByAppName: Record<string, number>,
    showNotificationsTray: boolean,
    notificationExpiryDays: number,
    isNewNotificationViewEnabled: boolean,
  }

  const normalizeNotificationCounts = useCallback((input: CamelCaseCountsResponse) => {
    const { countByAppName, ...countData } = input;
    const appIds = Object.keys(countByAppName);
    const notificationApps = appIds.reduce<Record<string, string[]>>((acc, appId) => {
      acc[appId] = [];
      return acc;
    }, {});

    return {
      ...countData,
      appIds,
      notificationApps,
      countByAppName,
    };
  }, []);

  const normalizeNotifications = (data: {
    results: NotificationItem[],
    numPages: number,
    currentPage: number,
    next: string | null,
  }) => {
    const newNotificationIds = data.results.map(notification => notification.id.toString());
    const notificationsKeyValuePair = data.results.reduce<Record<string, NotificationItem>>((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {});
    const pagination: Pagination = {
      numPages: data.numPages,
      currentPage: data.currentPage,
      hasMorePages: !!data.next,
    };

    return {
      newNotificationIds, notificationsKeyValuePair, pagination,
    };
  };

  const getNotifications = useCallback((): NotificationItem[] => {
    try {
      const notificationIds = apps[appName] || [];

      return notificationIds.map((notificationId) => notifications[notificationId]) || [];
    } catch (error) {
      return [];
    }
  }, [apps, appName, notifications]);

  const fetchAppsNotificationCount = useCallback(async (): Promise<NotificationAppData> => {
    try {
      const data = await getNotificationCounts();
      const normalisedData = normalizeNotificationCounts(camelCaseObject(data));

      const {
        countByAppName, appIds, notificationApps, count, showNotificationsTray, notificationExpiryDays,
        isNewNotificationViewEnabled,
      } = normalisedData;

      return {
        tabsCount: { count, ...countByAppName },
        appsId: appIds,
        apps: notificationApps,
        showNotificationsTray,
        notificationStatus: RequestStatus.SUCCESSFUL,
        notificationExpiryDays,
        isNewNotificationViewEnabled,
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED,
        apps: {},
        appsId: [],
        isNewNotificationViewEnabled: false,
        notificationExpiryDays: 0,
        showNotificationsTray: false,
        tabsCount: { count: 0 },
      };
    }
  }, [normalizeNotificationCounts]);

  const fetchNotificationList = useCallback(async (
    app: string,
    page = 1,
    pageSize = 10,
    trayOpened = true,
  ): Promise<Partial<NotificationContextValue>> => {
    try {
      updateNotificationData({ notificationListStatus: RequestStatus.IN_PROGRESS });
      const data = await getNotificationsList(app, page, pageSize, trayOpened);
      const normalizedData = normalizeNotifications(camelCaseObject(data));

      const {
        newNotificationIds, notificationsKeyValuePair, pagination,
      } = normalizedData;

      const existingNotificationIds = apps[appName] || [];
      const { count } = tabsCount;

      return {
        apps: {
          ...apps,
          [appName]: Array.from(new Set([...existingNotificationIds, ...newNotificationIds])),
        },
        notifications: { ...notifications, ...notificationsKeyValuePair },
        tabsCount: {
          ...tabsCount,
          count: count - (tabsCount[appName] || 0),
          [appName]: 0,
        },
        notificationListStatus: RequestStatus.SUCCESSFUL,
        pagination,
      };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [appName, apps, tabsCount, notifications, updateNotificationData]);

  const markNotificationsAsSeen = useCallback(async (app: string) => {
    try {
      await markNotificationSeen(app);

      return { notificationStatus: RequestStatus.SUCCESSFUL };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async (app: string) => {
    try {
      await markAllNotificationRead(app);
      const updatedNotifications = Object.fromEntries(
        Object.entries(notifications).map(([key, notification]) => [
          key, { ...notification, lastRead: new Date().toISOString() },
        ]),
      ) as Record<string, NotificationItem>;

      return {
        notifications: updatedNotifications,
        notificationStatus: RequestStatus.SUCCESSFUL,
      };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [notifications]);

  const markNotificationsAsRead = useCallback(async (notificationId: number) => {
    try {
      const result: { id: number, data: unknown } = camelCaseObject(
        await markNotificationRead(notificationId),
      );

      const date = new Date().toISOString();
      const notificationList: Record<string, NotificationItem> = { ...notifications };
      notificationList[result.id] = { ...notifications[result.id], lastRead: date };

      return {
        notifications: notificationList,
        notificationStatus: RequestStatus.SUCCESSFUL,
      };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [notifications]);

  return {
    fetchAppsNotificationCount,
    fetchNotificationList,
    getNotifications,
    markNotificationsAsSeen,
    markAllNotificationsAsRead,
    markNotificationsAsRead,
  };
}

export function useAppNotifications() {
  const authenticatedUser = useAuthenticatedUser();
  const [isNewNotificationView, setIsNewNotificationView] = useState(false);
  const [notificationAppData, setNotificationAppData] = useState<NotificationAppData | undefined>(undefined);
  const { fetchAppsNotificationCount } = useNotification();
  const location = useLocation();

  const fetchNotificationData = useCallback(async () => {
    const data = await fetchAppsNotificationCount();
    const { isNewNotificationViewEnabled } = data;

    setIsNewNotificationView(isNewNotificationViewEnabled);
    setNotificationAppData(data);
  }, [fetchAppsNotificationCount]);

  useEffect(() => {
    const fetchNotifications = async () => {
      await fetchNotificationData();
    };
    if (authenticatedUser) {
      fetchNotifications();
    }
  }, [fetchNotificationData, authenticatedUser, location.pathname]);

  return {
    isNewNotificationView,
    notificationAppData,
  };
}
