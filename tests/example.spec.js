const { test, expect } = require('@playwright/test');

test('open sauce demo', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});