class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryInfo = page.locator('.summary_info');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.cartQuantity = page.locator('.cart_quantity');
  }

  /**
   * Starts the checkout flow from the cart page.
   */
  async startCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Fills in checkout info and submits. Empty strings are skipped,
   * allowing tests to simulate missing-field validation errors.
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} postalCode
   */
  async fillInfo(firstName, lastName, postalCode) {
    if (firstName) await this.firstNameInput.fill(firstName);
    if (lastName) await this.lastNameInput.fill(lastName);
    if (postalCode) await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /**
   * Reads the visible checkout validation error message.
   * @returns {Promise<string>} the error message shown on screen
   */
  async getErrorText() {
    return await this.errorMessage.textContent();
  }

  /**
   * Cancels checkout and returns to the previous page.
   */
  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { CheckoutPage };