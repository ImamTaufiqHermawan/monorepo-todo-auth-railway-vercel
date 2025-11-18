export default {
  // Direktori test dan coverage
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Exclude entry point
    '!**/node_modules/**',
  ],
  
  // Threshold coverage minimum (adjusted for current test coverage)
  coverageThreshold: {
    global: {
      branches: 28,
      functions: 39,
      lines: 47,
      statements: 47
    }
  },

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Timeout untuk tests
  testTimeout: 60000,

  // Verbose output
  verbose: true,
};
