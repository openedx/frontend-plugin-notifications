import React, { StrictMode } from 'react';
import Notifications from './Notification';
import { useAppNotifications, useNotification } from './Notification/data/hook';

export const NotificationsTray = (props) => {
  const { notificationAppData } = useAppNotifications();
  return notificationAppData?.showNotificationsTray
    ? <StrictMode><Notifications notificationAppData={notificationAppData} {...props} /></StrictMode>
    : '';
};

export default NotificationsTray;
export { Notifications, useAppNotifications, useNotification };
