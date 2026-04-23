import React, { ComponentType } from 'react';

import { useAppNotifications, NotificationAppData } from './data/hook';

export interface WithNotificationsProps {
  notificationAppData?: NotificationAppData,
}

export default function withNotifications<P extends WithNotificationsProps>(
  Component: ComponentType<P>,
) {
  return function WrapperComponent(props: Omit<P, 'notificationAppData'>) {
    const { notificationAppData } = useAppNotifications();
    return <Component {...(props as P)} notificationAppData={notificationAppData} />;
  };
}
