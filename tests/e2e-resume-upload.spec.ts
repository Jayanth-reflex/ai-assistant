import { test, expect } from '@playwright/test';

test('Resume upload and parsing works', async ({ page }) => {
  await page.goto('http://localhost:5180');
  await expect(page.locator('.resume-upload-container')).toBeVisible();
  // Simulate file upload (stub: assumes test.pdf exists in project root)
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('.resume-upload-container input[type="file"]');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('tests/test.pdf');
  await expect(page.locator('.resume-upload-container')).toContainText('Name:');
  await expect(page.locator('.resume-upload-container')).toContainText('Skills:');
}); 