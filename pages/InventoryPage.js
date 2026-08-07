class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async addToCart(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async removeFromCart(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async getCartCount() {
    return await this.cartBadge.textContent();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption('lohi');
  }

  async getFirstItemPrice() {
    return await this.itemPrices.first().textContent();
  }

  async sortByPriceHighToLow() {
    await this.sortDropdown.selectOption('hilo');
  }

  async sortByNameAZ() {
    await this.sortDropdown.selectOption('az');
  }

  async sortByNameZA() {
    await this.sortDropdown.selectOption('za');
  }

  async getFirstItemName() {
    return await this.page.locator('.inventory_item_name').first().textContent();
  }

  async getCartItemName() {
    return await this.page.locator('.cart_item .inventory_item_name').first().textContent();
  }
}

module.exports = { InventoryPage }