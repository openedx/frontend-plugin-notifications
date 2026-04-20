import MockAdapter from 'axios-mock-adapter';
import { Factory } from 'rosie';

import { getAuthenticatedHttpClient } from '@openedx/frontend-base';

import {
  getNotificationsListApiUrl, getNotificationsCountApiUrl, markNotificationsSeenApiUrl, markNotificationAsReadApiUrl,
} from './data/api';
import { getDiscussionTourUrl } from './tours/data/api';

import './data/__factories__';

const notificationCountsApiUrl = getNotificationsCountApiUrl();
const notificationsApiUrl = getNotificationsListApiUrl();
const markedAllNotificationsAsSeenApiUrl = markNotificationsSeenApiUrl('discussion');
const markedAllNotificationsAsReadApiUrl = markNotificationAsReadApiUrl();
const notificationsTourApiUrl = getDiscussionTourUrl();

export default async function mockNotificationsResponse(todaycount = 8, earlierCount = 2) {
  const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  const notifications = (Factory.buildList('notification', todaycount, null, { createdDate: new Date().toISOString() }).concat(
    Factory.buildList('notification', earlierCount, null, { createdDate: '2023-06-01T00:46:11.979531Z' }),
  ));
  axiosMock.onGet(notificationCountsApiUrl).reply(200, (Factory.build('notificationsCount')));
  axiosMock.onGet(notificationsTourApiUrl).reply(200, []);
  axiosMock.onPut(markedAllNotificationsAsSeenApiUrl).reply(200, { message: 'Notifications marked seen.' });
  axiosMock.onPatch(markedAllNotificationsAsReadApiUrl).reply(200, { message: 'Notifications marked read.' });

  axiosMock.onGet(notificationsApiUrl).reply(200, (Factory.build('notificationsList', {
    results: notifications,
    num_pages: 2,
    current_page: 2,
    next: `${notificationsApiUrl}?app_name=discussion&page=2`,
  })));
}
