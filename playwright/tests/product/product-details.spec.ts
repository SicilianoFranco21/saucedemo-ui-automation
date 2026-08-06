import { test, expect } from '../../fixtures/fixtures.js';
import type { Product } from '../../models/product.model.js';
import productsData from '../../data/products.json' with { type: 'json' };

// Feature: Product details

const PRODUCTS: Product[] = Object.values(productsData.products);

test.describe('Product details', { tag: '@regression' }, () => {
  // Rule: Product detail page displays correct information for each product

  for (const product of PRODUCTS) {
    test.describe(`"${product.name}"`, () => {
      // Background:
      //   Given the user is on the inventory page
      //   And the user opens the product detail page
      test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.productList.openProductByName(product.name);
      });

      // Scenario: displays correct product details
      test('displays correct details', async ({ productPage }) => {
        // Then the correct product detail page is displayed with the expected data
        await expect(productPage.page).toHaveURL(new RegExp(`inventory-item\\.html\\?id=${product.id}`));
        await expect(productPage.productItem.title).toHaveText(product.name);
        await expect(productPage.productItem.description).toHaveText(product.description);
        await expect(productPage.productItem.price).toHaveText(`$${product.price}`);
      });

      // Scenario: adds product to the cart
      test('adds to the cart from the product details page', async ({ productPage }) => {
        // When the user adds the product to the cart
        await productPage.productItem.addToCart();

        // Then the cart badge shows 1 and the remove button is enabled
        await expect(productPage.header.cartItemsCount()).resolves.toBe('1');
        await expect(productPage.productItem.removeButton).toBeEnabled();
      });

      // Scenario: removes product from the cart
      test('removes from the cart from the product details page', async ({ productPage }) => {
        // Given the user has added the product to the cart
        await productPage.productItem.addToCart();

        // When the user removes the product from the cart
        await productPage.productItem.removeFromCart();

        // Then the cart badge is not visible and the add to cart button is enabled
        await expect(productPage.header.cartCountBadge).not.toBeVisible();
        await expect(productPage.productItem.addToCartButton).toBeEnabled();
      });
    });
  }
});
