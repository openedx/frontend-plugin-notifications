import type MockAdapter from 'axios-mock-adapter';

// Return an empty list so the onboarding overlay stays dismissed.
// Replace with a real Tour entry if you want to exercise the tour UI.
export function registerToursMocks(mock: MockAdapter, lmsBaseUrl: string): void {
  mock.onGet(`${lmsBaseUrl}/api/user_tours/discussion_tours/`).reply(200, []);
  mock.onPut(new RegExp(`^${lmsBaseUrl}/api/user_tours/discussion_tours/.*`)).reply(200, {
    id: 1, tour_name: 'discussion_tour', enabled: false, show_tour: false,
  });
}
