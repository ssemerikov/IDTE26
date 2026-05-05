const { test, expect } = require('@playwright/test');

test('lab01 pages: var5 and var8 exist and contain expected scene elements', async ({ page }) => {
  // var5
  await page.goto('/lab01/var5/vr.html');
  await expect(page.locator('a-scene')).toHaveCount(1);

  await page.goto('/lab01/var5/arjs.html');
  // AR.js marker-based page should include an <a-marker>
  await expect(page.locator('a-marker')).toHaveCount(1);

  await page.goto('/lab01/var5/mindar.html');
  // MindAR scene should include a-scene with mindar-image attribute
  await expect(page.locator('a-scene[mindar-image]')).toHaveCount(1);

  // var8
  await page.goto('/lab01/var8/vr.html');
  await expect(page.locator('a-scene')).toHaveCount(1);

  await page.goto('/lab01/var8/arjs.html');
  await expect(page.locator('a-marker')).toHaveCount(1);

  await page.goto('/lab01/var8/mindar.html');
  await expect(page.locator('a-scene[mindar-image]')).toHaveCount(1);
});
