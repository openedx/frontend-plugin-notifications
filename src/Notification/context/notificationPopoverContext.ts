import React, { RefObject } from 'react';

export interface NotificationPopoverContextValue {
  popoverHeaderRef: RefObject<HTMLElement> | null,
  notificationRef: RefObject<HTMLElement> | null,
}

const notificationPopoverContext = React.createContext<NotificationPopoverContextValue>({
  popoverHeaderRef: null,
  notificationRef: null,
});

export default notificationPopoverContext;
