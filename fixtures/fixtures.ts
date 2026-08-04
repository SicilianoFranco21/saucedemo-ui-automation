import { test as base } from '@playwright/test';
import { navigationFixtures, type NavigationFixtures } from './navigation.fixture.js';
import { pageObjectFixtures, type PageObjectFixtures } from './page-object.fixture.js';

type SauceDemoFixtures = NavigationFixtures & PageObjectFixtures;

const fixtures = {
  authenticatedPage: navigationFixtures.authenticatedPage,
  loginPage: pageObjectFixtures.loginPage,
  inventoryPage: pageObjectFixtures.inventoryPage,
  cartPage: pageObjectFixtures.cartPage,
  checkoutStepOnePage: pageObjectFixtures.checkoutStepOnePage,
  checkoutStepTwoPage: pageObjectFixtures.checkoutStepTwoPage,
  checkoutCompletePage: pageObjectFixtures.checkoutCompletePage,
  productPage: pageObjectFixtures.productPage,
};

export const test = base.extend<SauceDemoFixtures>(fixtures);

export { expect } from '@playwright/test';
