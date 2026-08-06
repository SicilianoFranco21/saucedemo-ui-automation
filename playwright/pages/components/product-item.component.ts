import type { Locator } from '@playwright/test';

export class ProductItemComponent {
  private readonly root: Locator;

  constructor(root: Locator) {
    this.root = root;
  }

  get title(): Locator {
    return this.root.getByTestId('inventory-item-name');
  }

  get description(): Locator {
    return this.root.getByTestId('inventory-item-desc');
  }

  get price(): Locator {
    return this.root.getByTestId('inventory-item-price');
  }

  get addToCartButton(): Locator {
    return this.root.locator('[data-test^="add-to-cart"]');
  }

  get removeButton(): Locator {
    return this.root.locator('[data-test^="remove"]');
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async open(): Promise<void> {
    await this.title.click();
  }
}
