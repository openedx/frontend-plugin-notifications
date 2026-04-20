import React from 'react';

import {
  fireEvent, render, screen, waitFor, within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { Factory } from 'rosie';

import {
  IntlProvider,
  SiteContext,
  getAuthenticatedHttpClient,
  getSiteConfig,
  initializeMockApp,
} from '@openedx/frontend-base';

import { getNotificationsListApiUrl, getNotificationsCountApiUrl } from './data/api';
import Notifications from './index';
import mockNotificationsResponse from './test-utils';
import './data/__factories__';
import { useAppNotifications } from './data/hook';
import { getDiscussionTourUrl } from './tours/data/api';

const notificationCountsApiUrl = getNotificationsCountApiUrl();
const notificationsApiUrl = getNotificationsListApiUrl();
const notificationsTourApiUrl = getDiscussionTourUrl();

let axiosMock: MockAdapter;

const authenticatedUser = {
  userId: 3,
  username: 'abc123',
  email: 'abc@example.com',
  name: 'Abc User',
  avatar: '',
  administrator: true,
  roles: [],
};

const NotificationComponent = () => {
  const { notificationAppData } = useAppNotifications();
  if (notificationAppData?.showNotificationsTray) {
    return <Notifications notificationAppData={notificationAppData} />;
  }
  return null;
};

async function renderComponent() {
  render(
    <MemoryRouter>
      <SiteContext.Provider value={{ authenticatedUser, siteConfig: getSiteConfig(), locale: 'en' }}>
        <IntlProvider locale="en" messages={{}}>
          <NotificationComponent />
        </IntlProvider>
      </SiteContext.Provider>
    </MemoryRouter>,
  );
}

describe('Notification sections test cases.', () => {
  beforeEach(async () => {
    initializeMockApp({ authenticatedUser });

    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    Factory.resetAll();
  });

  it('Successfully viewed last 24 hours and earlier section along with mark all as read label.', async () => {
    await mockNotificationsResponse();
    await renderComponent();

    const bellIcon = await screen.findByTestId('notification-bell-icon');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      const notificationTraySection = screen.queryByTestId('notification-tray-section');
      expect(notificationTraySection).not.toBeNull();
      const section = notificationTraySection as HTMLElement;

      expect(within(section).queryByText('Last 24 hours')).toBeInTheDocument();
      expect(within(section).queryByText('Earlier')).toBeInTheDocument();
      expect(within(section).queryByText('Mark all as read')).toBeInTheDocument();
    });
  });

  it('Successfully marked all notifications as read, removing the unread status.', async () => {
    await mockNotificationsResponse();
    await renderComponent();

    const bellIcon = await screen.findByTestId('notification-bell-icon');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.queryByTestId('unread-notification-1')).toBeInTheDocument();
    });

    const markAllReadButton = await screen.findByTestId('mark-all-read');
    fireEvent.click(markAllReadButton);

    await waitFor(() => {
      expect(screen.queryByTestId('unread-notification-1')).not.toBeInTheDocument();
    });
  });

  it('Successfully load more notifications by clicking on load more notification button.', async () => {
    await mockNotificationsResponse(10, 2);
    await renderComponent();

    const bellIcon = await screen.findByTestId('notification-bell-icon');
    fireEvent.click(bellIcon);

    const loadMoreButton = await screen.findByTestId('load-more-notifications');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.queryAllByTestId('notification-contents')).toHaveLength(12);
    });
  });

  it('Successfully showed No notification yet message when the notification tray is empty.', async () => {
    const notificationCountsMock = {
      show_notifications_tray: true,
      count: 0,
      count_by_app_name: {
        discussion: 0,
      },
      isNewNotificationViewEnabled: true,
    };

    axiosMock.onGet(notificationCountsApiUrl).reply(200, notificationCountsMock);
    axiosMock.onGet(notificationsApiUrl).reply(200, { results: [] });
    axiosMock.onGet(notificationsTourApiUrl).reply(200, []);

    await renderComponent();

    const bellIcon = await screen.findByTestId('notification-bell-icon');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.queryByTestId('notifications-empty-list')).toBeInTheDocument();
    });
  });
});
