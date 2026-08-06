import { test, expect } from '../../playwright/fixtures/fixtures.js';
import { addProducts } from '../../helpers/inventory.helper.js';
import { calculateSubtotal, calculateTax, calculateTotal } from '../../helpers/calculations.helper.js';
import { parsePrice } from '../../helpers/price.parser.js';
import type { CheckoutStepOnePage } from '../../playwright/pages/checkout-step-one-page.js';
import type { Product } from '../../models/product.model.js';
import productsData from '../../data/products.json' with { type: 'json' };
import checkoutData from '../../data/sample-checkout-data.json' with { type: 'json' };

// Feature: Checkout

const PRODUCTS: Product[] = Object.values(productsData.products);
const PRODUCT_NAMES: string[] = PRODUCTS.map((p: Product) => p.name);
const { firstName, lastName, postalCode } = checkoutData.userInformation.sampleInfo1;

test.describe('Checkout', { tag: '@regression' }, () => {
  // Rule: Customer information form validates required fields before proceeding

  test.describe('Step 1 - Customer Information', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user is on the checkout step one page

    test.beforeEach(async ({ checkoutStepOnePage }) => {
      await checkoutStepOnePage.navigate();
    });

    // Scenario Outline: shows an error when a required field is missing
    type ErrorScenario = {
      name: string;
      fill: (page: CheckoutStepOnePage) => Promise<void>;
      expectedError: string;
    };

    const errorScenarios: ErrorScenario[] = [
      {
        name: 'first name is missing',
        fill: (page) => page.fillCheckoutForm(undefined, lastName, postalCode),
        expectedError: 'First Name is required',
      },
      {
        name: 'last name is missing',
        fill: (page) => page.fillCheckoutForm(firstName, undefined, postalCode),
        expectedError: 'Last Name is required',
      },
      {
        name: 'postal code is missing',
        fill: (page) => page.fillCheckoutForm(firstName, lastName, undefined),
        expectedError: 'Postal Code is required',
      },
    ];

    for (const scenario of errorScenarios) {
      test(`shows an error when ${scenario.name}`, async ({ checkoutStepOnePage }) => {
        // When the user submits the form with a missing required field
        await scenario.fill(checkoutStepOnePage);
        await checkoutStepOnePage.continue();

        // Then an error message is displayed
        await expect(checkoutStepOnePage.errorMessage).toContainText(scenario.expectedError);
      });
    }

    test('cancel returns to the cart', async ({ checkoutStepOnePage, cartPage }) => {
      // When the user cancels
      await checkoutStepOnePage.cancel();

      // Then the user is redirected to the cart
      await expect(cartPage.page).toHaveURL(/cart\.html$/);
    });
  });

  // Rule: Order overview displays the correct products and pricing

  test.describe('Step 2 - Overview', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user has added all products to the cart
    //   And has completed the customer information form

    test.beforeEach(async ({ inventoryPage, cartPage, checkoutStepOnePage }) => {
      await addProducts(inventoryPage, PRODUCT_NAMES);
      await cartPage.navigate();
      await cartPage.checkout();
      await checkoutStepOnePage.completeCheckoutStep(firstName, lastName, postalCode);
    });

    test('displays all products in the order summary', async ({ checkoutStepTwoPage }) => {
      // Then all added products are listed in the overview
      const count: number = await checkoutStepTwoPage.productList.getCount();
      expect(count).toBe(PRODUCT_NAMES.length);

      for (const name of PRODUCT_NAMES) {
        await expect(checkoutStepTwoPage.productList.getProductByName(name).title).toBeVisible();
      }
    });

    test('displays the correct subtotal', async ({ checkoutStepTwoPage }) => {
      // Then the subtotal matches the sum of all product prices
      const expectedSubtotal: number = calculateSubtotal(PRODUCTS);
      const subtotalText: string | null = await checkoutStepTwoPage.itemSubtotalAmount.textContent();
      expect(parsePrice(subtotalText)).toBeCloseTo(expectedSubtotal, 2);
    });

    test('displays the correct tax', async ({ checkoutStepTwoPage }) => {
      // Then the tax matches 8% of the subtotal
      const expectedTax: number = calculateTax(calculateSubtotal(PRODUCTS));
      const taxText: string | null = await checkoutStepTwoPage.taxAmount.textContent();
      expect(parsePrice(taxText)).toBeCloseTo(expectedTax, 2);
    });

    test('displays the correct total', async ({ checkoutStepTwoPage }) => {
      // Then the total matches subtotal plus tax
      const expectedTotal: number = calculateTotal(PRODUCTS);
      const totalText: string | null = await checkoutStepTwoPage.totalAmount.textContent();
      expect(parsePrice(totalText)).toBeCloseTo(expectedTotal, 2);
    });

    test('cancel returns to the inventory', async ({ checkoutStepTwoPage, inventoryPage }) => {
      // When the user cancels the order
      await checkoutStepTwoPage.cancel();

      // Then the user is redirected to the inventory page
      await expect(inventoryPage.page).toHaveURL(/inventory\.html$/);
    });
  });

  // Rule: Completing an order shows a confirmation and resets the cart

  test.describe('Complete', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user has completed the order overview
    //   And has clicked finish

    test.beforeEach(async ({ inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage }) => {
      await addProducts(inventoryPage, PRODUCT_NAMES);
      await cartPage.navigate();
      await cartPage.checkout();
      await checkoutStepOnePage.completeCheckoutStep(firstName, lastName, postalCode);
      await checkoutStepTwoPage.finish();
    });

    test('redirects to the confirmation page', async ({ checkoutCompletePage }) => {
      // Then the user lands on the checkout complete page
      await expect(checkoutCompletePage.page).toHaveURL(/checkout-complete\.html$/);
    });

    test('displays a success message', async ({ checkoutCompletePage }) => {
      // Then a success header and description are visible
      await expect(checkoutCompletePage.checkoutCompleteTitle).toHaveText('Thank you for your order!');
      await expect(checkoutCompletePage.checkoutCompleteDescription).toBeVisible();
    });

    test('back home returns to the inventory', async ({ checkoutCompletePage, inventoryPage }) => {
      // When the user clicks back home
      await checkoutCompletePage.backHome();

      // Then the user is redirected to the inventory page
      await expect(inventoryPage.page).toHaveURL(/inventory\.html$/);
    });
  });
});
