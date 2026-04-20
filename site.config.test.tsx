import { SiteConfig } from '@openedx/frontend-base';

const siteConfig: SiteConfig = {
  siteId: 'notifications-test',
  siteName: 'Notifications (test)',
  baseUrl: 'http://localhost',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost/login',
  logoutUrl: 'http://localhost/logout',
  environment: 'test' as SiteConfig['environment'],
};

export default siteConfig;
