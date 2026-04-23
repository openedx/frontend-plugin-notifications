import React, { StrictMode } from 'react';
import Notifications from './Notification';
import { useAppNotifications } from './Notification/data/hook';

interface NotificationsTrayProps {
  margins?: string,
}

const NotificationsTray: React.FC<NotificationsTrayProps> = (props) => {
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
