import type { Page, Locator } from '@playwright/test';
import { SauceDemoBasePage } from './saucedemo-base-page.js';
import { ProductListComponent } from './components/product-list.component.js';

export class CheckoutStepTwoPage extends SauceDemoBasePage {
  readonly url: string = '/checkout-step-two.html';
  readonly productList: ProductListComponent;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly paymentInformationValue: Locator;
  readonly shippingInformationValue: Locator;
  readonly itemSubtotalAmount: Locator;
  readonly taxAmount: Locator;
  readonly totalAmount: Locator;

  constructor(page: Page) {
    super(page);
    const cartItems: Locator = page.getByTestId('cart-list');
    this.productList = new ProductListComponent(cartItems);
    this.cancelButton = page.getByTestId('cancel');
    this.finishButton = page.getByTestId('finish');
    this.paymentInformationValue = page.getByTestId('payment-info-value');
    this.shippingInformationValue = page.getByTestId('shipping-info-value');
    this.itemSubtotalAmount = page.getByTestId('subtotal-label');
    this.taxAmount = page.getByTestId('tax-label');
    this.totalAmount = page.getByTestId('total-label');
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
