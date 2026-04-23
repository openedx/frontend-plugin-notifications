const { createConfig } = require('@openedx/frontend-base/tools');

module.exports = createConfig('test', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.tsx',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.tsx',
    'src/i18n',
    'src/__mocks__',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svg.js',
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
});
