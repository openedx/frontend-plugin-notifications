import React from 'react';
import Notifications from './Notification';
import { useAppNotifications, useNotification } from './Notification/data/hook';

export const NotificationsTray = () => {
  const { notificationAppData } = useAppNotifications();
  return notificationAppData?.showNotificationsTray
    ? <Notifications notificationAppData={notificationAppData} />
    : '';
};

export default NotificationsTray;
export { Notifications, useAppNotifications, useNotification };
