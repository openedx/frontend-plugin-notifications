import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { notificationsApp } from './src';

import '@openedx/frontend-base/shell/style';

const siteConfig: SiteConfig = {
  siteId: 'notifications-ci',
  siteName: 'Notifications (CI)',
  baseUrl: 'http://apps.local.openedx.io',
  lmsBaseUrl: 'http://local.openedx.io',
  loginUrl: 'http://local.openedx.io/login',
  logoutUrl: 'http://local.openedx.io/logout',

  environment: EnvironmentTypes.PRODUCTION,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    notificationsApp,
  ],
};

export default siteConfig;
