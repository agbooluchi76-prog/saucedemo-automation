const { test, expect } = require('@playwright/test');
async function login(page, username, password) {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#login-button').click();
}

test('valid login redirects to inventory page', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory.html/);
});

test('invalid login shows error message', async ({ page }) => {
  await login(page, 'wrong_user', 'wrong_password');

  const errorText = await page.locator('[data-test="error"]').textContent();
  expect(errorText).toContain('Username and password do not match');
});
test('locked out user cannot log in', async ({ page }) => {
  await login(page, 'locked_out_user', 'secret_sauce');

  const currentUrl = page.url();
  expect(currentUrl === 'https://www.saucedemo.com/').toBe(true);
});