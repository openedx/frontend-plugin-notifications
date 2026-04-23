import MockAdapter from 'axios-mock-adapter';

import {
  SITE_AUTH_INITIALIZED,
  getAuthService,
  getAuthenticatedHttpClient,
  getSiteConfig,
  subscribe,
  unsubscribe,
} from '@openedx/frontend-base';

import { registerNotificationsMocks } from './notifications';
import { registerToursMocks } from './tours';

function install(): void {
  const client = getAuthenticatedHttpClient();
  if (!client) {
    return;
  }
  const siteConfig = getSiteConfig();
  const { lmsBaseUrl } = siteConfig;

  const mock = new MockAdapter(client, { onNoMatch: 'passthrough' });
  registerNotificationsMocks(mock, lmsBaseUrl);
  registerToursMocks(mock, lmsBaseUrl);

  // CSRF token fetches go through a separate axios instance; mock it too.
  const csrfClient = getAuthService()?.getCsrfTokenService?.()?.getHttpClient?.();
  if (csrfClient) {
    const csrfMock = new MockAdapter(csrfClient, { onNoMatch: 'passthrough' });
    const csrfPath = siteConfig.csrfTokenApiPath ?? '/csrf/api/v1/token';
    csrfMock.onGet(new RegExp(`${csrfPath.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}$`))
      .reply(200, { csrfToken: 'dev-mock-csrf-token' });
  }
}

export function installDevMocks(): void {
  const onAuthInit = () => {
    install();
    unsubscribe(SITE_AUTH_INITIALIZED, onAuthInit);
  };
  subscribe(SITE_AUTH_INITIALIZED, onAuthInit);
}
