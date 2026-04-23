import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { camelCaseObject, useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import tourCheckpoints from '../constants';
import { getNotificationsTours, updateNotificationsTour } from './api';
import { Tour } from '../../context/notificationsContext';
import { QK } from '../../data/hook';

export function camelToConstant(string: string): string {
  return string.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase();
}

function normaliseTourData(data: Tour[]): Tour[] {
  return data.map(tour => ({ ...tour, enabled: true }));
}

export function useTours() {
  return useQuery({
    queryKey: QK.tours(),
    queryFn: async (): Promise<Tour[]> => {
      const data = await getNotificationsTours();
      return camelCaseObject(normaliseTourData(data));
    },
  });
}

export function useUpdateTourShowStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tourId: number) => updateNotificationsTour(tourId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.tours() });
    },
  });
}

export function useTourConfiguration() {
  const intl = useIntl();
  const { data: tours } = useTours();
  const { mutate: updateTour } = useUpdateTourShowStatus();

  return useMemo(
    () => {
      const checkpointsByKey = tourCheckpoints(intl);
      return tours?.map((tour) => {
        const key = camelToConstant(tour.tourName);
        if (!(key in checkpointsByKey)) {
          return false;
        }
        return {
          tourId: tour.tourName,
          dismissButtonText: intl.formatMessage(messages.dismissButtonText),
          endButtonText: intl.formatMessage(messages.endButtonText),
          enabled: Boolean(tour.enabled && tour.showTour),
          onEnd: () => updateTour(tour.id),
          checkpoints: checkpointsByKey[key],
        };
      }) ?? [];
    },
    [intl, tours, updateTour],
  );
}
