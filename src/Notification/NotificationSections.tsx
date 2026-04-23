import React, { useCallback, useContext, useMemo } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { useIntl } from '@openedx/frontend-base';
import { Button, Icon, Spinner } from '@openedx/paragon';
import { AutoAwesome, CheckCircleLightOutline } from '@openedx/paragon/icons';

import NotificationPopoverContext from './context/notificationPopoverContext';
import messages from './messages';
import NotificationEmptySection from './NotificationEmptySection';
import NotificationRowItem from './NotificationRowItem';
import { splitNotificationsByTime } from './utils';
import { notificationsContext, NotificationItem } from './context/notificationsContext';
import { NotificationAppData, useMarkAllNotificationsRead, useNotificationList } from './data/hook';

interface NotificationSectionsProps {
  notificationAppData: NotificationAppData,
}

const NotificationSections: React.FC<NotificationSectionsProps> = ({ notificationAppData }) => {
  const intl = useIntl();
  const { appName } = useContext(notificationsContext);
  const { appsId, notificationExpiryDays } = notificationAppData;

  const {
    notifications: notificationList, hasMorePages, isPending, isFetching, loadMore,
  } = useNotificationList(appName);
  const { mutateAsync: markAllAsRead } = useMarkAllNotificationsRead();

  const { popoverHeaderRef, notificationRef } = useContext(NotificationPopoverContext);
  const { today = [], earlier = [] } = useMemo(
    () => splitNotificationsByTime(notificationList),
    [notificationList],
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead(appName);
  }, [appName, markAllAsRead]);

  const renderNotificationSection = (section: 'today' | 'earlier', items: NotificationItem[]) => {
    if (isEmpty(items)) {
      return null;
    }

    return (
      <div className="pb-2">
        <div className="d-flex justify-content-between align-items-center py-2 mb-2">
          <span className="text-gray-500 line-height-10">
            {section === 'today' && intl.formatMessage(messages.notificationTodayHeading)}
            {section === 'earlier' && intl.formatMessage(messages.notificationEarlierHeading)}
          </span>
          {notificationList?.length > 0 && (section === 'earlier' ? today.length === 0 : true) && (
            <Button
              variant="link"
              className="small line-height-10 text-decoration-none p-0 border-0 text-info-500"
              onClick={handleMarkAllAsRead}
              size="sm"
              data-testid="mark-all-read"
            >
              {intl.formatMessage(messages.notificationMarkAsRead)}
            </Button>
          )}
        </div>
        {items.map((notification) => (
          <NotificationRowItem
            key={notification.id}
            id={notification.id}
            type={notification.notificationType}
            contentUrl={notification.contentUrl}
            content={notification.content}
            courseName={notification.contentContext?.courseName || ''}
            createdAt={notification.created}
            lastRead={notification.lastRead}
          />
        ))}
      </div>
    );
  };

  const isSuccess = !isPending && !isFetching;
  const shouldRenderEmptyNotifications = notificationList?.length === 0
    && isSuccess
    && notificationRef?.current
    && popoverHeaderRef?.current;

  return (
    <div
      className={classNames('px-4', {
        'mt-4': appsId.length > 1,
        'pb-3.5': appsId.length > 0,
      })}
      data-testid="notification-tray-section"
    >
      {renderNotificationSection('today', today)}
      {renderNotificationSection('earlier', earlier)}
      {isFetching ? (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" variant="primary" data-testid="notifications-loading-spinner" />
        </div>
      ) : (hasMorePages && isSuccess && notificationList.length >= 10 && (
        <Button
          variant="primary"
          className="w-100 bg-primary-500 load-more-btn"
          onClick={loadMore}
          data-testid="load-more-notifications"
        >
          {intl.formatMessage(messages.loadMoreNotifications)}
        </Button>
      )
      )}
      {
        notificationList.length > 0 && !hasMorePages && isSuccess && (
          <div
            className="d-flex flex-column my-5"
            data-testid="notifications-list-complete"
          >
            <Icon className="mx-auto icon-size-56" src={CheckCircleLightOutline} />
            <div className="mx-auto mb-3  mt-3.5 lead notification-end-title line-height-24">
              {intl.formatMessage(messages.allRecentNotificationsMessage)}
            </div>
            <div className="d-flex flex-row mx-auto text-gray-500">
              <Icon src={AutoAwesome} />
              <span className="small line-height-normal">
                {intl.formatMessage(messages.expiredNotificationsDeleteMessage, { days: notificationExpiryDays })}
              </span>
            </div>
          </div>
        )
      }

      {shouldRenderEmptyNotifications && <NotificationEmptySection />}
    </div>
  );
};

export default React.memo(NotificationSections);
