const { test, expect } = require('@playwright/test');
require('dotenv').config();
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test('valid login redirects to inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

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
  await loginPage.login('locked_out_user', process.env.SAUCE_PASSWORD);

  const currentUrl = page.url();
  expect(currentUrl === 'https://www.saucedemo.com/').toBe(true);
});

test('add item to cart updates cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');

  const cartBadge = await inventoryPage.getCartCount();
  expect(cartBadge).toBe('1');
});

test('checkout with valid info succeeds', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Felicia', 'Agbo', '900001');

  await expect(checkoutPage.summaryInfo).toBeVisible();
});

test('checkout blocks submission with missing last name', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Felicia', '', '900001');

  const errorText = await checkoutPage.getErrorText();
  expect(errorText).toContain('Last Name is required');
});

test('remove item from cart updates cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.removeFromCart('sauce-labs-backpack');

  await expect(inventoryPage.cartBadge).toHaveCount(0);
});

test('checkout blocks submission with missing postal code', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Felicia', 'Agbo', '');

  const errorText = await checkoutPage.getErrorText();
  expect(errorText).toContain('Postal Code is required');
});

test('adding multiple items updates cart badge count', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.addToCart('sauce-labs-bike-light');

  const cartBadge = await inventoryPage.getCartCount();
  expect(cartBadge).toBe('2');
});

test('sort products by price low to high', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.sortByPriceLowToHigh();

  const firstPrice = await inventoryPage.getFirstItemPrice();
  expect(firstPrice).toBe('$7.99');
});

test('checkout blocks submission with all fields empty', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('', '', '');

  const errorText = await checkoutPage.getErrorText();
  expect(errorText).toContain('First Name is required');
});

test('logout returns to login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.SAUCE_USERNAME, process.env.SAUCE_PASSWORD);

  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});