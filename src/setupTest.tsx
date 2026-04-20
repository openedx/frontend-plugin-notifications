import '@testing-library/jest-dom';
import React, { ReactNode } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import {
  configureI18n,
  configureLogging,
  IntlProvider,
  mergeSiteConfig,
} from '@openedx/frontend-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResizeObserver from 'resize-observer-polyfill';
import siteConfig from 'site.config';

(globalThis as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserver;

mergeSiteConfig(siteConfig);

const supressWarningBlock = (callback: () => void) => {
  const originalConsoleWarning = console.warn;
  console.warn = jest.fn();
  callback();
  console.warn = originalConsoleWarning;
};

class MockLoggingService {
  logInfo = jest.fn((infoString: string) => console.log(infoString));

  logError = jest.fn((errorString: string) => console.log(errorString));
}

export const initializeIntl = () => {
  configureLogging(MockLoggingService, {});

  // i18n doesn't have a service class to return.
  // ignore missing/unexpected locale warnings from the i18n layer
  // it is unnecessary and not relevant to the tests
  supressWarningBlock(() => configureI18n({
    messages: [],
  }));
};

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0, staleTime: 0 },
    mutations: { retry: false },
  },
});

function render(ui: React.ReactElement, renderOptions: Omit<RenderOptions, 'wrapper'> = {}) {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        {children}
      </IntlProvider>
    </QueryClientProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export default render;
