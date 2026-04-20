import { IntlShape } from 'react-intl';
import messages from './messages';

export default function tourCheckpoints(intl: IntlShape) {
  return {
    EXAMPLE_TOUR: [
      {
        title: intl.formatMessage(messages.exampleTourTitle),
        body: intl.formatMessage(messages.exampleTourBody),
        target: '#example-tour-target',
        placement: 'bottom' as const,
      },
    ],
  };
}
