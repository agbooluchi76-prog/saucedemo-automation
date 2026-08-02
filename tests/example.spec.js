const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const checkoutInfo = {
  firstName: 'Felicia',
  lastName: 'Agbo',
  postalCode: '900001',
};

test('valid login redirects to inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory.html/);
});

test('invalid login shows error message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('wrong_user', 'wrong_password');

  const errorText = await loginPage.getErrorText();
  expect(errorText).toContain('Username and password do not match');
});

test('locked out user cannot log in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('locked_out_user', 'secret_sauce');

  const currentUrl = page.url();
  expect(currentUrl === 'https://www.saucedemo.com/').toBe(true);
});

test('add item to cart updates cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  const cartBadge = await page.locator('.shopping_cart_badge').textContent();

  expect(cartBadge).toBe('1');
});

test('checkout with valid info succeeds', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

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
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('Felicia');
  await page.locator('[data-test="postalCode"]').fill('900001');
  await page.locator('[data-test="continue"]').click();

  const errorText = await page.locator('[data-test="error"]').textContent();
  expect(errorText).toContain('Last Name is required');
});

test('remove item from cart updates cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveCount(0);
});

test('checkout blocks submission with missing postal code', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('Felicia');
  await page.locator('[data-test="lastName"]').fill('Agbo');
  await page.locator('[data-test="continue"]').click();

  const errorText = await page.locator('[data-test="error"]').textContent();
  expect(errorText).toContain('Postal Code is required');
});

test('adding multiple items updates cart badge count', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  const cartBadge = await page.locator('.shopping_cart_badge').textContent();
  expect(cartBadge).toBe('2');
});

test('sort products by price low to high', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  const firstPrice = await page.locator('.inventory_item_price').first().textContent();
  expect(firstPrice).toBe('$7.99');
});

test('checkout blocks submission with all fields empty', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="continue"]').click();

  const errorText = await page.locator('[data-test="error"]').textContent();
  expect(errorText).toContain('First Name is required');
});

test('logout returns to login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});