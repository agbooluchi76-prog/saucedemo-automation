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
test('add item to cart updates cart badge', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  const cartBadge = await page.locator('.shopping_cart_badge').textContent();

  expect(cartBadge).toBe('1');
});
const checkoutInfo = {
  firstName: 'Felicia',
  lastName: 'Agbo',
  postalCode: '900001',
};

test('checkout with valid info succeeds', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill(checkoutInfo.firstName);
  await page.locator('[data-test="lastName"]').fill(checkoutInfo.lastName);
  await page.locator('[data-test="postalCode"]').fill(checkoutInfo.postalCode);
  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('.summary_info')).toBeVisible();
});
test('checkout blocks submission with missing last name', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('Felicia');
  await page.locator('[data-test="postalCode"]').fill('900001');
  await page.locator('[data-test="continue"]').click();

  const errorText = await page.locator('[data-test="error"]').textContent();
  expect(errorText).toContain('Last Name is required');
});