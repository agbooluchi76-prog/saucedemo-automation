class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  /**
   * Adds a product to the cart by its data-test product ID.
   * @param {string} productId - e.g. 'sauce-labs-backpack'
   */
  async addToCart(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  /**
   * Removes a product from the cart by its data-test product ID.
   * @param {string} productId - e.g. 'sauce-labs-backpack'
   */
  async removeFromCart(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Reads the current cart badge count.
   * @returns {Promise<string>} the number shown on the cart icon
   */
  async getCartCount() {
    return await this.cartBadge.textContent();
  }

  /**
   * Navigates to the cart page.
   */
  async goToCart() {
    await this.cartLink.click();
  }

  /**
   * Sorts products by price, low to high.
   */
  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption('lohi');
  }

  /**
   * Reads the price of the first product listed.
   * @returns {Promise<string>} the price text, e.g. '$7.99'
   */
  async getFirstItemPrice() {
    return await this.itemPrices.first().textContent();
  }

  /**
   * Sorts products by price, high to low.
   */
  async sortByPriceHighToLow() {
    await this.sortDropdown.selectOption('hilo');
  }

  /**
   * Sorts products by name, A to Z.
   */
  async sortByNameAZ() {
    await this.sortDropdown.selectOption('az');
  }

  /**
   * Sorts products by name, Z to A.
   */
  async sortByNameZA() {
    await this.sortDropdown.selectOption('za');
  }

  /**
   * Reads the name of the first product listed.
   * @returns {Promise<string>} the product name text
   */
  async getFirstItemName() {
    return await this.page.locator('.inventory_item_name').first().textContent();
  }

  /**
   * Reads the product name shown on the cart page.
   * @returns {Promise<string>} the product name text
   */
  async getCartItemName() {
    return await this.page.locator('.cart_item .inventory_item_name').first().textContent();
  }
}

module.exports = { InventoryPage }