import React, { useContext, useEffect } from 'react';

import { Tab, Tabs } from '@openedx/paragon';

import NotificationSections from './NotificationSections';
import { notificationsContext } from './context/notificationsContext';
import { NotificationAppData, useMarkNotificationSeen } from './data/hook';

interface NotificationTabsProps {
  notificationAppData: NotificationAppData,
}

const NotificationTabs: React.FC<NotificationTabsProps> = ({ notificationAppData }) => {
  const { appName, handleActiveTab } = useContext(notificationsContext);
  const { appsId, tabsCount } = notificationAppData;
  const { mutate: markSeen } = useMarkNotificationSeen();
  const unseenForActiveApp = appName ? (tabsCount[appName] ?? 0) : 0;

  useEffect(() => {
    if (appName && unseenForActiveApp > 0) {
      markSeen(appName);
    }
  }, [appName, unseenForActiveApp, markSeen]);

  return (
    appsId.length > 1
      ? (
          <Tabs
            variant="tabs"
            defaultActiveKey={appName}
            onSelect={handleActiveTab}
            className="px-2.5 text-primary-500 tabs position-sticky zIndex-2 bg-white"
          >
            {appsId.map((app) => (
              <Tab
                key={app}
                eventKey={app}
                title={app}
                notification={tabsCount[app]}
                tabClassName="pt-0 py-2 px-2.5 d-flex border-top-0 mb-0 align-items-center line-height-24 text-capitalize"
                data-testid={`notification-tab-${app}`}
              >
                {appName === app && <NotificationSections notificationAppData={notificationAppData} />}
              </Tab>
            ))}
          </Tabs>
        )
      : <NotificationSections notificationAppData={notificationAppData} />
  );
};

export default React.memo(NotificationTabs);
