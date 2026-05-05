const { devices } = require('@playwright/test');
module.exports = {
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:8080' },
  webServer: {
    command: 'npx serve . -p 8080',
    port: 8080,
    timeout: 120000,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chromium'] } },
  ],
};
