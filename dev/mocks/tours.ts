import type MockAdapter from 'axios-mock-adapter';

// Return one enabled tour so the onboarding overlay renders against
// #example-tour-target (see dev/index.tsx). tourCheckpoints defines a
// single 'exampleTour' config; the filter in useTourConfiguration
// matches tourName against those keys.
export function registerToursMocks(mock: MockAdapter, lmsBaseUrl: string): void {
  mock.onGet(`${lmsBaseUrl}/api/user_tours/discussion_tours/`).reply(200, [
    { id: 1, tour_name: 'exampleTour', enabled: true, show_tour: true },
  ]);
  mock.onPut(new RegExp(`^${lmsBaseUrl}/api/user_tours/discussion_tours/.*`)).reply(200, {
    id: 1, tour_name: 'exampleTour', enabled: true, show_tour: false,
  });
}
