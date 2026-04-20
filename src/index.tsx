import React, { StrictMode } from 'react';
import Notifications from './Notification';
import { useAppNotifications, useNotification } from './Notification/data/hook';

interface NotificationsTrayProps {
  margins?: string,
}

export const NotificationsTray: React.FC<NotificationsTrayProps> = (props) => {
  const { notificationAppData } = useAppNotifications();
  if (!notificationAppData?.showNotificationsTray) {
    return null;
  }
  return (
    <StrictMode>
      <Notifications notificationAppData={notificationAppData} {...props} />
    </StrictMode>
  );
};

export default NotificationsTray;
export { Notifications, useAppNotifications, useNotification };
