import type { Page, Locator } from '@playwright/test';
import { SauceDemoBasePage } from './saucedemo-base-page.js';
import { ProductListComponent } from './components/product-list.component.js';

export class CartPage extends SauceDemoBasePage {
  readonly url: string = '/cart.html';
  readonly productList: ProductListComponent;
  readonly cartTitle: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    const cartItems: Locator = page.getByTestId('cart-list');
    this.productList = new ProductListComponent(cartItems);
    this.cartTitle = page.getByTestId('title');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
