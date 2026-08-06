import type { Page, Locator } from '@playwright/test';
import { ProductsSortComponent } from './components/products-sort.component.js';
import { SauceDemoBasePage } from './saucedemo-base-page.js';
import { ProductListComponent } from './components/product-list.component.js';

export class InventoryPage extends SauceDemoBasePage {
  readonly url: string = '/inventory.html';
  readonly productsSort: ProductsSortComponent;
  readonly productList: ProductListComponent;

  constructor(page: Page) {
    super(page);
    const productItems: Locator = page.getByTestId('inventory-list');
    this.productList = new ProductListComponent(productItems);
    this.productsSort = new ProductsSortComponent(page);
  }
}
