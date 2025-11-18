import { defineConfig, devices } from '@playwright/test';

/**
 * Konfigurasi Playwright untuk E2E Testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory tempat test files berada
  testDir: './e2e',
  
  // Maximum time one test can run (30 detik)
  timeout: 30 * 1000,
  
  // Full parallel execution
  fullyParallel: true,
  
  // Fail build jika ada test yang di-skip dengan .only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI failures
  retries: process.env.CI ? 2 : 0,
  
  // Workers untuk parallel execution (1 di CI untuk stability)
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: process.env.CI 
    ? [['html'], ['github']] 
    : [['html'], ['list']],

  // Shared settings untuk semua projects
  use: {
    // Base URL untuk testing
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    // Slow motion for UI mode (500ms delay between actions)
    // Bisa diubah: 100 = cepat, 500 = medium, 1000 = lambat
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on first retry
    video: 'retain-on-failure',
    
    // Trace on first retry
    trace: 'on-first-retry',
  },

  // Configure projects untuk different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // slowMo bisa di-override per project jika perlu
      },
    },

    // Uncomment untuk test di browser lain
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile viewports untuk responsive testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Web server untuk dev testing
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
