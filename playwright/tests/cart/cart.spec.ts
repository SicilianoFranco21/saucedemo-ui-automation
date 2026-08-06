import { test, expect } from '../../fixtures/fixtures.js';
import { addProducts } from '../../helpers/inventory.helper.js';
import { removeProducts } from '../../helpers/cart.helper.js';
import type { Product } from '../../models/product.model.js';
import productsData from '../../data/products.json' with { type: 'json' };
import type { ProductItemComponent } from '../../pages/components/product-item.component.js';

// Feature: Cart

const PRODUCT_NAMES: string[] = Object.values(productsData.products).map((p: Product) => p.name);

test.describe('Cart', { tag: '@regression' }, () => {
  // Rule: Cart displays the products added from inventory

  test.describe('View Cart', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user is on the inventory page
    //   And has added all products to the cart

    test('displays all added products', async ({ inventoryPage, cartPage }) => {
      // Given all products have been added to the cart
      await addProducts(inventoryPage, PRODUCT_NAMES);

      // When the user navigates to the cart
      await cartPage.navigate();

      // Then all added products are visible in the cart
      const count: number = await cartPage.productList.getCount();
      expect(count).toBe(PRODUCT_NAMES.length);

      // And each product is identifiable by name
      for (const name of PRODUCT_NAMES) {
        await expect(cartPage.productList.getProductByName(name).title).toBeVisible();
      }
    });
  });

  // Rule: Products can be removed from the cart individually

  test.describe('Remove from Cart', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user is on the inventory page
    //   And the product has been added to the cart
    //   And the user navigates to the cart

    // Scenario Outline: removes <product> from the cart
    for (const name of PRODUCT_NAMES) {
      test(`removes "${name}" from the cart`, async ({ inventoryPage, cartPage }) => {
        const product: ProductItemComponent = inventoryPage.productList.getProductByName(name);
        await product.addToCart();
        await cartPage.navigate();

        // When the user removes the product from the cart
        await cartPage.productList.getProductByName(name).removeFromCart();

        // Then the product is no longer in the cart
        await expect(cartPage.productList.getProductByName(name).title).not.toBeAttached();

        // And the cart badge is not visible
        await expect(cartPage.header.cartCountBadge).not.toBeVisible();
      });
    }
  });

  // Rule: All products can be removed from the cart at once

  test('removes all products from the cart', async ({ inventoryPage, cartPage }) => {
    // Given all products have been added to the cart
    await addProducts(inventoryPage, PRODUCT_NAMES);
    // And the user navigates to the cart
    await cartPage.navigate();

    // When the user removes all products
    await removeProducts(cartPage, PRODUCT_NAMES);

    // Then the cart is empty
    const count: number = await cartPage.productList.getCount();
    expect(count).toBe(0);

    // And the cart badge is not visible
    await expect(cartPage.header.cartCountBadge).not.toBeVisible();
  });
});
