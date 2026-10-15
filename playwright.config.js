import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const chrome = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  // Keep local Chrome runs stable on the developer's desktop.
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4175',
    launchOptions: { executablePath: chrome, args: ['--no-sandbox'] },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
    env: { VITE_SUPABASE_URL: 'https://nativeshine-test.supabase.co', VITE_SUPABASE_ANON_KEY: 'fixture-anon-key' },
  },
});
