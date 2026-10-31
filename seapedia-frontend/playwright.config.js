import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1, // Demo logins revoke older tokens; serialize shared seeded actors.
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:15173',
    channel: process.env.CI ? undefined : 'chrome',
    locale: 'id-ID',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node tests/start-backend.mjs',
      url: 'http://127.0.0.1:18000/api/products',
      reuseExistingServer: false,
      timeout: 90_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 15173 --strictPort',
      env: { SEAPEDIA_API_PROXY_TARGET: 'http://127.0.0.1:18000', VITE_API_URL: '/api' },
      url: 'http://127.0.0.1:15173',
      reuseExistingServer: false,
      timeout: 90_000,
    },
  ],
})
