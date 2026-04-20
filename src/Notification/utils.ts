import { ComponentType } from 'react';

import {
  QuestionAnswerOutline,
  PostOutline,
  Report,
  Verified,
  Newspaper,
} from '@openedx/paragon/icons';

import { NotificationItem } from './context/notificationsContext';

export interface SplitNotifications {
  today: NotificationItem[],
  earlier: NotificationItem[],
}

export const splitNotificationsByTime = (
  notificationList: NotificationItem[],
): SplitNotifications => {
  const splittedData: SplitNotifications = { today: [], earlier: [] };
  if (notificationList.length > 0) {
    const currentTime = Date.now();
    const twentyFourHoursAgo = currentTime - (24 * 60 * 60 * 1000);

    notificationList.forEach((notification) => {
      if (notification) {
        const objectTime = new Date(notification.created).getTime();
        if (objectTime >= twentyFourHoursAgo && objectTime <= currentTime) {
          splittedData.today.push(notification);
        } else {
          splittedData.earlier.push(notification);
        }
      }
    });
    splittedData.today.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
    splittedData.earlier.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
  }
  return splittedData;
};

interface IconInfo {
  icon: ComponentType, class: string,
}

export const getIconByType = (type: string): IconInfo => {
  const iconMap: Record<string, IconInfo> = {
    new_response: { icon: QuestionAnswerOutline as ComponentType, class: 'text-primary-500' },
    new_comment: { icon: QuestionAnswerOutline as ComponentType, class: 'text-primary-500' },
    new_comment_on_response: { icon: QuestionAnswerOutline as ComponentType, class: 'text-primary-500' },
    content_reported: { icon: Report as ComponentType, class: 'text-danger' },
    response_endorsed: { icon: Verified as ComponentType, class: 'text-primary-500' },
    response_endorsed_on_thread: { icon: Verified as ComponentType, class: 'text-primary-500' },
    course_update: { icon: Newspaper as ComponentType, class: 'text-primary-500' },
  };
  return iconMap[type] || { icon: PostOutline as ComponentType, class: 'text-primary-500' };
};
