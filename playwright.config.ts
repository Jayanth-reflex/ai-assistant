import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Electron',
      use: {
        // Path to your Electron main process
        launchOptions: {
          args: ['.'],
        },
        // baseURL: 'http://localhost:5180', // Not needed for Electron
      },
      testMatch: /.*electron\.e2e\.ts$/,
    },
    // You can add more projects for web, etc.
  ],
}); 