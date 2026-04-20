import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import { Tour } from '../../context/notificationsContext';

export const getDiscussionTourUrl = (): string => `${getSiteConfig().lmsBaseUrl}/api/user_tours/discussion_tours/`;

export async function getNotificationsTours(): Promise<Tour[]> {
  const { data } = await getAuthenticatedHttpClient().get(getDiscussionTourUrl());
  return data;
}

export async function updateNotificationsTour(tourId: number): Promise<Tour> {
  const { data } = await getAuthenticatedHttpClient().put(
    `${getDiscussionTourUrl()}${tourId}`,
    { show_tour: false },
  );
  return data;
}
