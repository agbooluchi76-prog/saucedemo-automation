const { test, expect } = require('@playwright/test');

test('valid login redirects to inventory page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory.html/);
});

test('invalid login shows error message', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('wrong_user');
  await page.locator('#password').fill('wrong_password');
  await page.locator('#login-button').click();

  const errorText = await page.locator('[data-test="error"]').textContent();
  expect(errorText).toContain('Username and password do not match');
});
test('locked out user cannot log in', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const currentUrl = page.url();
  expect(currentUrl === 'https://www.saucedemo.com/').toBe(true);
});