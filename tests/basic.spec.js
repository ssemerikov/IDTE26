const { test, expect } = require('@playwright/test');

test('index has main demo links', async ({ page }) => {
  await page.goto('/');
  const check = async (href) => {
    const locator = page.locator(`a[href="${href}"]`);
    await expect(locator.first()).toHaveCount(1);
  };
  await check('week1/test1.html');
  await check('week2/test2.html');
  await check('week5/arindex.html');
});
