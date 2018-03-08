module.exports = {
  bail: true,
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [`src/**/*.js`],
  coveragePathIgnorePatterns: [`src/index.js`],
  coverageDirectory: `./coverage/`,
  coverageReporters: [`html`, `lcov`],
  setupFiles: [],
  modulePathIgnorePatterns: [`testHelpers/`],
  setupTestFrameworkScriptFile: `<rootDir>/src/__tests__/testHelpers/matchers/customMatchers.js`,
};
