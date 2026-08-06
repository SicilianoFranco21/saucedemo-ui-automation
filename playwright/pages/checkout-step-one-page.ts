import type { Page, Locator } from '@playwright/test';
import { SauceDemoBasePage } from './saucedemo-base-page.js';

export class CheckoutStepOnePage extends SauceDemoBasePage {
  readonly url: string = '/checkout-step-one.html';
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.cancelButton = page.getByTestId('cancel');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async fillCheckoutForm(
    firstName?: string,
    lastName?: string,
    postalCode?: string
  ): Promise<void> {
    if (firstName !== undefined) {
      await this.firstNameInput.fill(firstName);
    }
    if (lastName !== undefined) {
      await this.lastNameInput.fill(lastName);
    }
    if (postalCode !== undefined) {
      await this.postalCodeInput.fill(postalCode);
    }
  }

  async completeCheckoutStep(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillCheckoutForm(firstName, lastName, postalCode);
    await this.continue();
  }
}
