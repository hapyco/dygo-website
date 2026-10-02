import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.QA_BASE_URL ?? 'http://127.0.0.1:4323',
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
    ignoreHTTPSErrors: Boolean(process.env.QA_IGNORE_HTTPS_ERRORS),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.QA_BASE_URL ? undefined : {
    command: 'node scripts/preview.mjs',
    url: 'http://127.0.0.1:4323',
    reuseExistingServer: !process.env.CI,
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
  },
});
