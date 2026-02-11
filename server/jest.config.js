export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  transform: {},
  testPathIgnorePatterns: ['/node_modules/'],
};
