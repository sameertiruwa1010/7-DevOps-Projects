module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['text', 'lcov', 'clover'],
  verbose: true,
  testTimeout: 30000,
  setupFilesAfterFramework: [],
};
