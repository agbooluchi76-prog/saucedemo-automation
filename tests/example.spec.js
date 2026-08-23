const { test, expect } = require('../fixtures');
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

test('add item to cart updates cart badge', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');

  const cartBadge = await inventoryPage.getCartCount();
  expect(cartBadge).toBe('1');
});

test('checkout with valid info succeeds', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(loggedInPage);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Felicia', 'Agbo', '900001');

  await expect(checkoutPage.summaryInfo).toBeVisible();
});

test('checkout blocks submission with missing last name', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(loggedInPage);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Felicia', '', '900001');

  const errorText = await checkoutPage.getErrorText();
  expect(errorText).toContain('Last Name is required');
});

test('remove item from cart updates cart badge', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.removeFromCart('sauce-labs-backpack');

  await expect(inventoryPage.cartBadge).toHaveCount(0);
});

test('checkout blocks submission with missing postal code', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(loggedInPage);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Felicia', 'Agbo', '');

  const errorText = await checkoutPage.getErrorText();
  expect(errorText).toContain('Postal Code is required');
});

test('adding multiple items updates cart badge count', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.addToCart('sauce-labs-bike-light');

  const cartBadge = await inventoryPage.getCartCount();
  expect(cartBadge).toBe('2');
});

test('sort products by price low to high', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortByPriceLowToHigh();

  const firstPrice = await inventoryPage.getFirstItemPrice();
  expect(firstPrice).toBe('$7.99');
});

test('checkout blocks submission with all fields empty', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(loggedInPage);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('', '', '');

  const errorText = await checkoutPage.getErrorText();
  expect(errorText).toContain('First Name is required');
});

test('logout returns to login page', async ({ loggedInPage }) => {
  await loggedInPage.locator('#react-burger-menu-btn').click();
  const logoutLink = loggedInPage.locator('#logout_sidebar_link');
  await logoutLink.waitFor({ state: 'visible' });
  await logoutLink.click();

  await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/');
});

test('add third distinct product to cart', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');

  const cartBadge = await inventoryPage.getCartCount();
  expect(cartBadge).toBe('1');
});

test('cart persists after navigating away and back', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');

  await loggedInPage.locator('#react-burger-menu-btn').click();
  await loggedInPage.locator('#inventory_sidebar_link').click();

  const cartBadge = await inventoryPage.getCartCount();
  expect(cartBadge).toBe('1');
});

test('sort products by price high to low', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortByPriceHighToLow();

  const firstPrice = await inventoryPage.getFirstItemPrice();
  expect(firstPrice).toBe('$49.99');
});

test('sort products by name A to Z', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortByNameAZ();

  const firstName = await inventoryPage.getFirstItemName();
  expect(firstName).toBe('Sauce Labs Backpack');
});

test('sort products by name Z to A', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortByNameZA();

  const firstName = await inventoryPage.getFirstItemName();
  expect(firstName).toBe('Test.allTheThings() T-Shirt (Red)');
});

test('checkout cancel button returns to cart', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(loggedInPage);
  await checkoutPage.startCheckout();
  await checkoutPage.cancel();

  await expect(loggedInPage).toHaveURL(/cart.html/);
});

test('cart page shows correct product name after adding item', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const cartItemName = await inventoryPage.getCartItemName();
  expect(cartItemName).toBe('Sauce Labs Backpack');
});

test('checkout overview page shows correct item and quantity', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const checkoutPage = new CheckoutPage(loggedInPage);
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfo('Felicia', 'Agbo', '900001');

  const quantity = await checkoutPage.cartQuantity.textContent();
  expect(quantity).toBe('1');
});
 