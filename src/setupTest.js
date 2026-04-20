import '@testing-library/jest-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender } from '@testing-library/react';
import {
  getSiteConfig,
  configureI18n,
  configureLogging,
  IntlProvider,
} from '@openedx/frontend-base';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

// TODO (Phase 6): replace with `import siteConfig from 'site.config'; mergeSiteConfig(siteConfig);`
// once `site.config.test.tsx` is introduced in Phase 5.

const supressWarningBlock = (callback) => {
  const originalConsoleWarning = console.warn;
  console.warn = jest.fn();
  callback();
  console.warn = originalConsoleWarning;
};

class MockLoggingService {
  logInfo = jest.fn(infoString => console.log(infoString));

  logError = jest.fn(errorString => console.log(errorString));
}

export const initializeIntl = () => {
  const loggingService = configureLogging(MockLoggingService, {
    config: getSiteConfig(),
  });

  // i18n doesn't have a service class to return.
  // ignore missing/unexpected locale warnings from the i18n layer
  // it is unnecessary and not relevant to the tests
  supressWarningBlock(() => configureI18n({
    config: getSiteConfig(),
    loggingService,
    messages: [],
  }));
};

function render(
  ui,
  {
    ...renderOptions
  } = {},
) {
  const Wrapper = ({ children }) => (

    <IntlProvider locale="en">
      {children}
    </IntlProvider>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export default render;
