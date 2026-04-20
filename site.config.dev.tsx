import {
  EnvironmentTypes,
  SiteConfig,
  footerApp,
  headerApp,
  shellApp,
} from '@openedx/frontend-base';

import notificationsApp from './src/app';
import devApp from './dev';

import './src/app.scss';

const siteConfig: SiteConfig = {
  siteId: 'notifications-dev',
  siteName: 'Notifications Dev',
  baseUrl: 'http://apps.local.openedx.io:1992',
  basename: '/notifications',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    notificationsApp,
    devApp,
  ],
  externalRoutes: [
    {
      role: 'org.openedx.frontend.role.account',
      url: 'http://apps.local.openedx.io:1997/account/',
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
