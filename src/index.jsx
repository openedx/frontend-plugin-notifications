import React, { StrictMode } from 'react';
import Notifications from './Notification';
import { useAppNotifications, useNotification } from './Notification/data/hook';

export const NotificationsTray = () => {
  const { notificationAppData } = useAppNotifications();
  return notificationAppData?.showNotificationsTray
    ? <StrictMode><Notifications notificationAppData={notificationAppData} /></StrictMode>
    : '';
};

export default NotificationsTray;
export { Notifications, useAppNotifications, useNotification };
