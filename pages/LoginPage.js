class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Navigates to the Sauce Demo login page.
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Fills in credentials and submits the login form.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Reads the visible login error message text.
   * @returns {Promise<string>} the error message shown on screen
   */
  async getErrorText() {
    return await this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };