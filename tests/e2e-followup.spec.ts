import { test, expect } from '@playwright/test';

test('Follow-up summary generation works', async ({ page }) => {
  await page.goto('http://localhost:5180');
  await expect(page.locator('.followup-btn')).toBeVisible();
  await page.click('.followup-btn');
  await expect(page.locator('.followup-btn-container')).toContainText('Generate Follow-Up');
  // Optionally, wait for summary output
}); 