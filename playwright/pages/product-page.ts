import type { Page, Locator } from '@playwright/test';
import { ProductItemComponent } from './components/product-item.component.js';
import { SauceDemoBasePage } from './saucedemo-base-page.js';

export class ProductPage extends SauceDemoBasePage {
  readonly url: string = '/inventory-item.html';
  readonly productItem: ProductItemComponent;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    const productItemLocator: Locator = page.getByTestId('inventory-item');
    this.productItem = new ProductItemComponent(productItemLocator);
    this.backToProductsButton = page.getByTestId('back-to-products');
  }

  private buildUrl(id: string | number): string {
    return `${this.url}?id=${id}`;
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async openById(id: string | number): Promise<void> {
    await this.page.goto(this.buildUrl(id));
  }
}
