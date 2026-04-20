import React from 'react';

import {
  fireEvent, render, screen, waitFor, within,
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
import { useAppNotifications } from './data/hook';
import mockNotificationsResponse from './test-utils';
import { createTestQueryClient } from '../setupTest';

import './data/__factories__';

const authenticatedUser = {
  userId: 123,
  username: 'testuser',
  email: 'testuser@example.com',
  name: 'Test User',
  avatar: '',
  administrator: false,
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

describe('Notification Tabs test cases.', () => {
  beforeEach(async () => {
    initializeMockApp({ authenticatedUser });

    Factory.resetAll();

    await mockNotificationsResponse();
  });

  it('Successfully displayed with default discussion tab selected under notification tabs .', async () => {
    await renderComponent();

    const bellIcon = await screen.findByTestId('notification-bell-icon');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      const tabs = screen.queryAllByRole('tab');
      const selectedTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');

      expect(tabs.length).toEqual(5);
      expect(selectedTab).toBeDefined();
      expect(within(selectedTab as HTMLElement).queryByText('discussion')).toBeInTheDocument();
    });
  });

  it('Successfully showed unseen counts for unselected tabs.', async () => {
    await renderComponent();

    const bellIcon = await screen.findByTestId('notification-bell-icon');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');

      expect(within(tabs[0]).queryByRole('status')).toBeInTheDocument();
    });
  });

  it('Successfully selected reminder tab.', async () => {
    await renderComponent();

    const bellIcon = await screen.findByTestId('notification-bell-icon');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      const selectedTab = screen.queryByTestId('notification-tab-reminders');
      expect(selectedTab).not.toHaveClass('active');
    });

    const notificationTab = screen.getAllByRole('tab');
    fireEvent.click(notificationTab[0], { dataset: { rbEventKey: 'reminders' } });

    await waitFor(() => {
      const selectedTab = screen.queryByTestId('notification-tab-reminders');
      expect(selectedTab).toHaveClass('active');
    });
  });
});
