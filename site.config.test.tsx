import type { SiteConfig } from '@openedx/frontend-base';

import notificationsApp from './src/app';
import { appId } from './src/constants';

const siteConfig: SiteConfig = {
  siteId: 'notifications-test',
  siteName: 'Notifications (test)',
  baseUrl: 'http://localhost',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost/login',
  logoutUrl: 'http://localhost/logout',

  // Use 'test' instead of EnvironmentTypes.TEST to break a circular dependency
  // when mocking `@openedx/frontend-base` itself.
  environment: 'test' as SiteConfig['environment'],
  apps: [
    notificationsApp,
    {
      appId,
      config: {
        ACCOUNT_SETTINGS_URL: 'http://localhost/account',
      },
    },
  ],
};

export default siteConfig;
