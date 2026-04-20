import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { useAppConfig, useIntl } from '@openedx/frontend-base';
import {
  Bubble, Hyperlink, Icon, IconButton, OverlayTrigger, Popover,
} from '@openedx/paragon';
import { NotificationsNone, Settings } from '@openedx/paragon/icons';

import { useIsOnLargeScreen, useIsOnMediumScreen, NotificationAppData } from './data/hook';
import NotificationTour from './tours/NotificationTour';
import NotificationPopoverContext from './context/notificationPopoverContext';
import messages from './messages';
import NotificationTabs from './NotificationTabs';
import { notificationsContext, NotificationContextValue } from './context/notificationsContext';

import './notification.scss';

interface NotificationsProps {
  notificationAppData?: NotificationAppData,
  margins?: string,
}

const defaultNotificationAppData: NotificationAppData = {
  apps: {},
  tabsCount: { count: 0 },
  appsId: [],
  isNewNotificationViewEnabled: false,
  notificationExpiryDays: 0,
  showNotificationsTray: false,
};

const Notifications: React.FC<NotificationsProps> = ({
  notificationAppData = defaultNotificationAppData,
  margins = 'mx-1.5',
}) => {
  const intl = useIntl();
  const appConfig = useAppConfig() as { ACCOUNT_SETTINGS_URL?: string };
  const popoverRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [enableNotificationTray, setEnableNotificationTray] = useState(false);
  const [appName, setAppName] = useState('discussion');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [openFlag, setOpenFlag] = useState(false);
  const isOnMediumScreen = useIsOnMediumScreen();
  const isOnLargeScreen = useIsOnLargeScreen();

  const { tabsCount } = notificationAppData;

  const toggleNotificationTray = useCallback(() => {
    setEnableNotificationTray(prevState => !prevState);
  }, []);

  const handleClickOutsideNotificationTray = useCallback((event: MouseEvent) => {
    const target = event.target as Node;
    if (!popoverRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
      setEnableNotificationTray(false);
    }
  }, []);

  useEffect(() => {
    if (openFlag || Object.keys(tabsCount).length === 0) {
      return;
    }
    setAppName(searchParams.get('app') || 'discussion');
    setEnableNotificationTray(searchParams.get('showNotifications') === 'true');
    setOpenFlag(true);
  }, [tabsCount, openFlag, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutsideNotificationTray);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotificationTray);
      window.removeEventListener('scroll', handleScroll);
      setAppName('discussion');
    };
  }, [handleClickOutsideNotificationTray]);

  const notificationRefs = useMemo(
    () => ({ popoverHeaderRef: headerRef, notificationRef: popoverRef }),
    [headerRef, popoverRef],
  );

  const handleActiveTab = useCallback((selectedAppName: string) => {
    setAppName(selectedAppName);
  }, []);

  const notificationContextValue = useMemo<NotificationContextValue>(() => ({
    appName,
    handleActiveTab,
  }), [appName, handleActiveTab]);

  const accountSettingsUrl = appConfig.ACCOUNT_SETTINGS_URL ?? '';
  const settingsDestination = `${
    accountSettingsUrl && accountSettingsUrl.endsWith('/')
      ? `${accountSettingsUrl}#notifications`
      : `${accountSettingsUrl}/#notifications`
  }`;

  return (
    <notificationsContext.Provider value={notificationContextValue}>
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="bottom"
        show={enableNotificationTray}
        overlay={(
          <Popover
            id="notificationTray"
            data-testid="notification-tray"
            className={classNames('overflow-auto rounded-0 border-0 position-fixed ml-1.5 mt-2', {
              'w-100': !isOnMediumScreen && !isOnLargeScreen,
              'medium-screen': isOnMediumScreen,
              'large-screen': isOnLargeScreen,
              'popover-margin-top height-100vh': !isHeaderVisible,
              'height-91vh ': isHeaderVisible,
            })}
          >
            <div ref={popoverRef} className="height-inherit">
              <div ref={headerRef}>
                <Popover.Title
                  as="h1"
                  className={`d-flex justify-content-between px-4 pt-4 pb-2.5 m-0 border-0 text-primary-500 zIndex-2 font-size-18
                  line-height-24 bg-white position-sticky`}
                >
                  {intl.formatMessage(messages.notificationTitle)}
                  <Hyperlink
                    destination={settingsDestination}
                    target="_blank"
                    showLaunchIcon={false}
                  >
                    <Icon
                      src={Settings}
                      className="text-primary-500 icon-size-20"
                      data-testid="setting-icon"
                      screenReaderText="preferences settings icon"
                    />
                  </Hyperlink>
                </Popover.Title>
              </div>
              <Popover.Content className="notification-content p-0">
                <NotificationPopoverContext.Provider value={notificationRefs}>
                  <NotificationTabs notificationAppData={notificationAppData} />
                </NotificationPopoverContext.Provider>
              </Popover.Content>
            </div>
          </Popover>
        )}
      >
        <div ref={buttonRef} id="notificationIcon" className={`${margins}`}>
          <IconButton
            isActive={enableNotificationTray}
            alt={intl.formatMessage(messages.notificationBellIconAltMessage)}
            onClick={toggleNotificationTray}
            src={NotificationsNone}
            iconAs={Icon}
            variant="light"
            iconClassNames="text-primary-500"
            size="inline"
            className="notification-button"
            data-testid="notification-bell-icon"
          />
          {tabsCount?.count > 0 && (
            <div
              role="button"
              tabIndex={0}
              onClick={toggleNotificationTray}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  toggleNotificationTray();
                }
              }}
              className="d-inline-block"
            >
              <Bubble
                variant="error"
                data-testid="notification-count"
                className={classNames('notification-badge zindex-1 cursor-pointer p-1', {
                  'notification-badge-unrounded mt-1': tabsCount.count >= 10,
                  'notification-badge-rounded': tabsCount.count < 10,
                })}
              >
                {tabsCount.count >= 100 ? <div className="d-flex">99<p className="mb-0 plus-icon">+</p></div>
                  : tabsCount.count}
              </Bubble>
            </div>
          )}
        </div>
      </OverlayTrigger>
      <NotificationTour />
    </notificationsContext.Provider>
  );
};

export default Notifications;
