const base = require('@playwright/test');
require('dotenv').config();
const { LoginPage } = require('./pages/LoginPage');

exports.test = base.test.extend({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);
    await use(page);
  },
});
exports.expect = base.expect;