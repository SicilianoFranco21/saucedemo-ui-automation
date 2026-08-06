import { BasePage } from './base-page.js';
import type { Page, Locator } from '@playwright/test';
import type { User } from '../models/user.model.js';

export class LoginPage extends BasePage {
  readonly url: string = '/';
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(user: User): Promise<void> {
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.submit();
  }
}
