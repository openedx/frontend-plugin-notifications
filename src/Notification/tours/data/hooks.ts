import { useMemo, useContext, useCallback } from 'react';
import { camelCaseObject, useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import tourCheckpoints from '../constants';
import { getNotificationsTours, updateNotificationsTour } from './api';
import { RequestStatus } from '../../data/constants';
import { notificationsContext, Tour } from '../../context/notificationsContext';

export function camelToConstant(string: string): string {
  return string.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase();
}

export function useNotificationTour() {
  const { tours, updateNotificationData } = useContext(notificationsContext);

  function normaliseTourData(data: Tour[]): Tour[] {
    return data.map(tour => ({ ...tour, enabled: true }));
  }

  const fetchNotificationTours = useCallback(async () => {
    try {
      const data = await getNotificationsTours();
      const normalizedData: Tour[] = camelCaseObject(normaliseTourData(data));

      return { tours: normalizedData, loading: RequestStatus.SUCCESSFUL };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, []);

  const updateTourShowStatus = useCallback(async (tourId: number) => {
    try {
      const data = await updateNotificationsTour(tourId);
      const normalizedData: Tour = camelCaseObject(data);
      const nextTours = [...(tours ?? [])];
      const tourIndex = nextTours.findIndex(tour => tour.id === normalizedData.id);
      if (tourIndex !== -1) {
        nextTours[tourIndex] = normalizedData;
      }

      return { tours: nextTours, loading: RequestStatus.SUCCESSFUL };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [tours]);

  const handleOnOkay = useCallback(async (id: number) => {
    const data = await updateTourShowStatus(id);
    updateNotificationData(data);
  }, [updateNotificationData, updateTourShowStatus]);

  // TODO (Phase 4.5): port to react-query. Today this function is named as a hook
  // but does not actually follow hooks rules; the plan explicitly calls for its rewrite.
  const intl = useIntl();
  const toursConfig = useMemo(() => (
    tours?.map((tour) => Object.keys(tourCheckpoints(intl)).includes(tour.tourName) && (
      {
        tourId: tour.tourName,
        dismissButtonText: intl.formatMessage(messages.dismissButtonText),
        endButtonText: intl.formatMessage(messages.endButtonText),
        enabled: Boolean(tour.enabled && tour.showTour),
        onEnd: () => handleOnOkay(tour.id),
        checkpoints: tourCheckpoints(intl)[camelToConstant(tour.tourName)],
      }
    ))
  ), [intl, tours, handleOnOkay]);

  const useTourConfiguration = () => toursConfig;

  return {
    fetchNotificationTours,
    updateTourShowStatus,
    useTourConfiguration,
  };
}
