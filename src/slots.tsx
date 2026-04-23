import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import { appId } from './constants';
import NotificationsTray from './NotificationsTray';

const slots: SlotOperation[] = [
  {
    slotId: 'org.openedx.frontend.slot.header.desktopRight.v1',
    id: `${appId}.widget.notificationsBell.desktop.v1`,
    op: WidgetOperationTypes.INSERT_BEFORE,
    relatedId: 'org.openedx.frontend.widget.header.desktopAuthenticatedMenu.v1',
    element: <NotificationsTray />,
    condition: { authenticated: true },
  },
  {
    slotId: 'org.openedx.frontend.slot.header.mobileRight.v1',
    id: `${appId}.widget.notificationsBell.mobile.v1`,
    op: WidgetOperationTypes.INSERT_BEFORE,
    relatedId: 'org.openedx.frontend.widget.header.mobileAuthenticatedMenu.v1',
    element: <NotificationsTray />,
    condition: { authenticated: true },
  },
];

export default slots;
