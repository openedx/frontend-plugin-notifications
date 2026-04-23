import {
  App,
  LinkMenuItem,
  WidgetOperationTypes,
} from '@openedx/frontend-base';
import { Container } from '@openedx/paragon';

import { installDevMocks } from './mocks';

installDevMocks();

// NotificationRowItem unconditionally calls window.open after marking read.
// In dev we want to stay on the page and just see the read-state effect.
const originalWindowOpen = window.open.bind(window);
window.open = (url, target, features) => {
  if (target === '_blank') {
    console.info('[dev] window.open suppressed:', url);
    return null;
  }
  return originalWindowOpen(url, target, features);
};

export const devApp: App = {
  appId: 'notifications-dev-site',
  routes: [{
    path: '/',
    element: (
      <Container fluid size="xl" className="py-4">
        <h1>Notifications dev site</h1>
        <p>Sign in to see the notifications bell in the header.</p>
        <p><span id="example-tour-target">Tour target element.</span></p>
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
