import React from 'react';

import {
  act, fireEvent, render, screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Factory } from 'rosie';

import {
  IntlProvider,
  SiteContext,
  getSiteConfig,
  initializeMockApp,
} from '@openedx/frontend-base';
import { QueryClientProvider } from '@tanstack/react-query';

import Notifications from './index';
import mockNotificationsResponse from './test-utils';
import { createTestQueryClient } from '../setupTest';

import './data/__factories__';
import { useAppNotifications } from './data/hook';

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
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SiteContext.Provider value={{ authenticatedUser, siteConfig: getSiteConfig(), locale: 'en' }}>
          <IntlProvider locale="en" messages={{}}>
            <NotificationComponent />
          </IntlProvider>
        </SiteContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Notification row item test cases.', () => {
  beforeEach(async () => {
    initializeMockApp({ authenticatedUser });

    Factory.resetAll();

    await mockNotificationsResponse();
  });

  it(
    'Successfully viewed notification icon, notification context, unread , course name and notification time.',
    async () => {
      await renderComponent();

      await waitFor(async () => {
        const bellIcon = await screen.findByTestId('notification-bell-icon');
        await act(async () => {
          fireEvent.click(bellIcon);
        });

        expect(screen.queryByTestId('notification-icon-1')).toBeInTheDocument();
        expect(screen.queryByTestId('notification-content-1')).toBeInTheDocument();
        expect(screen.queryByTestId('notification-course-1')).toBeInTheDocument();
        expect(screen.queryByTestId('notification-created-date-1')).toBeInTheDocument();
        expect(screen.queryByTestId('unread-notification-1')).toBeInTheDocument();
      });
    },
  );

  it('Successfully marked notification as read.', async () => {
    await renderComponent();

    await waitFor(async () => {
      const bellIcon = await screen.findByTestId('notification-bell-icon');
      await act(async () => {
        fireEvent.click(bellIcon);
      });

      const notification = screen.queryByTestId('notification-1');
      if (notification) {
        await act(async () => {
          fireEvent.click(notification);
        });
      }

      expect(screen.queryByTestId('unread-notification-1')).not.toBeInTheDocument();
    });
  });
});
