const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'src/tests/e2e',
  testMatch: /.*\.spec\.js$/,
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 }
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    timeout: 120000,
    reuseExistingServer: true
  }
});