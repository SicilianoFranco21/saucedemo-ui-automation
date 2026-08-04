import type { Page } from '@playwright/test';
import type { FixtureContext, FixtureUse } from './fixture-types.js';
import { LoginPage } from '../pages/login-page.js';
import { InventoryPage } from '../pages/inventory-page.js';
import { CartPage } from '../pages/cart-page.js';
import { CheckoutStepOnePage } from '../pages/checkout-step-one-page.js';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two-page.js';
import { CheckoutCompletePage } from '../pages/checkout-complete-page.js';
import { ProductPage } from '../pages/product-page.js';

export type PageObjectFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  productPage: ProductPage;
};

export const pageObjectFixtures = {
  loginPage: async ({ page }: FixtureContext, use: FixtureUse<LoginPage>) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  inventoryPage: async ({ authenticatedPage }: FixtureContext, use: FixtureUse<InventoryPage>) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await use(inventoryPage);
  },

  cartPage: async ({ authenticatedPage }: FixtureContext, use: FixtureUse<CartPage>) => {
    const cartPage = new CartPage(authenticatedPage);
    await use(cartPage);
  },

  checkoutStepOnePage: async ({ authenticatedPage }: FixtureContext, use: FixtureUse<CheckoutStepOnePage>) => {
    const checkoutStepOnePage = new CheckoutStepOnePage(authenticatedPage);
    await use(checkoutStepOnePage);
  },

  checkoutStepTwoPage: async ({ authenticatedPage }: FixtureContext, use: FixtureUse<CheckoutStepTwoPage>) => {
    const checkoutStepTwoPage = new CheckoutStepTwoPage(authenticatedPage);
    await use(checkoutStepTwoPage);
  },

  checkoutCompletePage: async ({ authenticatedPage }: FixtureContext, use: FixtureUse<CheckoutCompletePage>) => {
    const checkoutCompletePage = new CheckoutCompletePage(authenticatedPage);
    await use(checkoutCompletePage);
  },

  productPage: async ({ authenticatedPage }: FixtureContext, use: FixtureUse<ProductPage>) => {
    const productPage = new ProductPage(authenticatedPage);
    await use(productPage);
  },
};
