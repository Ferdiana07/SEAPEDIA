import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    channel: process.env.CI ? undefined : 'chrome',
    locale: 'id-ID',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'php artisan serve --host=127.0.0.1 --port=8000',
      cwd: '../seapedia-backend',
      url: 'http://127.0.0.1:8000/api/products',
      reuseExistingServer: true,
      timeout: 90_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: true,
      timeout: 90_000,
    },
  ],
})
