import type { Page, Locator } from '@playwright/test';
import { SauceDemoBasePage } from './saucedemo-base-page.js';

export class CheckoutCompletePage extends SauceDemoBasePage {
  readonly url: string = '/checkout-complete.html';
  readonly checkoutCompleteTitle: Locator;
  readonly checkoutCompleteDescription: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutCompleteTitle = page.getByTestId('complete-header');
    this.checkoutCompleteDescription = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
