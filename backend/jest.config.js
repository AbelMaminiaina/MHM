export default {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
  ],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {},
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
  testTimeout: 10000,
  verbose: true,
};
