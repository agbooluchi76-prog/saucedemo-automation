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
}

module.exports = { InventoryPage };