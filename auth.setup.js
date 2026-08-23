const { chromium } = require('@playwright/test');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL);
  await page.locator('#user-name').fill(process.env.SAUCE_USERNAME);
  await page.locator('#password').fill(process.env.SAUCE_PASSWORD);
  await page.locator('#login-button').click();
  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
})();