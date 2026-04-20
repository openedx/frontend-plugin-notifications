import {
  App,
  EnvironmentTypes,
  LinkMenuItem,
  SiteConfig,
  WidgetOperationTypes,
  footerApp,
  headerApp,
  shellApp,
} from '@openedx/frontend-base';
import { Container } from '@openedx/paragon';

import notificationsApp from './src/app';
import { appId } from './src/constants';

import './src/app.scss';

const devTestPageApp: App = {
  appId: 'notifications-dev-test-page',
  routes: [{
    path: '/',
    element: (
      <Container fluid size="xl" className="py-4">
        <h1>Notifications dev site</h1>
        <p>Sign in to see the notifications bell in the header.</p>
      </Container>
    ),
  }],
  slots: [{
    slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
    id: 'notifications-dev-home-link',
    op: WidgetOperationTypes.APPEND,
    element: <LinkMenuItem label="Home" url="/" variant="navLink" />,
  }],
};

const siteConfig: SiteConfig = {
  siteId: 'notifications-dev',
  siteName: 'Notifications Dev',
  baseUrl: 'http://apps.local.openedx.io:1992',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    notificationsApp,
    devTestPageApp,
    {
      appId,
      config: {
        ACCOUNT_SETTINGS_URL: 'http://apps.local.openedx.io:1997/account',
      },
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
