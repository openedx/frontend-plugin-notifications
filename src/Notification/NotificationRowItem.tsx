import React, { useCallback } from 'react';

import * as timeago from 'timeago.js';
import DOMPurify from 'dompurify';

import { useIntl } from '@openedx/frontend-base';
import { Icon, Hyperlink } from '@openedx/paragon';

import messages from './messages';
import timeLocale from '../common/time-locale';
import { getIconByType } from './utils';
import { useMarkNotificationRead } from './data/hook';

interface NotificationRowItemProps {
  id: number,
  type?: string,
  contentUrl: string,
  content: string,
  courseName: string,
  createdAt: string,
  lastRead?: string | null,
}

const NotificationRowItem: React.FC<NotificationRowItemProps> = ({
  id, type = '', contentUrl, content, courseName, createdAt, lastRead = '',
}) => {
  timeago.register('time-locale', timeLocale);
  const intl = useIntl();
  const { mutateAsync: markAsRead } = useMarkNotificationRead();
  const sanitizedContent = DOMPurify.sanitize(content);

  const handleMarkAsRead = useCallback(async () => {
    if (!lastRead) {
      await markAsRead(id);
    }
  }, [id, lastRead, markAsRead]);

  const handleNotificationClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    await handleMarkAsRead();

    window.open(contentUrl, '_blank');
  };

  const { icon: iconComponent, class: iconClass } = getIconByType(type);

  return (
    <Hyperlink
      target="_blank"
      className="d-flex mb-2 align-items-center text-decoration-none notification-post-link"
      destination={contentUrl}
      onClick={handleNotificationClick}
      data-testid={`notification-${id}`}
      showLaunchIcon={false}
    >
      <Icon
        src={iconComponent}
        className={`${iconClass} mr-4 notification-icon`}
        data-testid={`notification-icon-${id}`}
      />
      <div className="d-flex w-100" data-testid="notification-contents">
        <div className="d-flex align-items-center w-100">
          <div className="py-2 w-100 px-0 cursor-pointer">
            <span
              className="line-height-24 text-gray-700 mb-2 notification-item-content overflow-hidden content"

              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              data-testid={`notification-content-${id}`}
            />
            <div className="py-0 d-flex">
              <span className="x-small text-gray-500 line-height-20">
                <span data-testid={`notification-course-${id}`}>{courseName}
                </span>
                <span className="text-light-700 px-1.5">{intl.formatMessage(messages.fullStop)}</span>
                <span data-testid={`notification-created-date-${id}`}> {timeago.format(createdAt, 'time-locale')}
                </span>
              </span>
            </div>
          </div>
          {!lastRead && (
            <div className="d-flex py-1.5 px-1.5 ml-2 cursor-pointer">
              <span className="bg-brand-500 rounded unread" data-testid={`unread-notification-${id}`} />
            </div>
          )}
        </div>
      </div>
    </Hyperlink>
  );
};

export default React.memo(NotificationRowItem);
