import { test, expect } from '../../fixtures/fixtures.js';
import { addProducts } from '../../helpers/inventory.helper.js';
import type { ProductItemComponent } from '../../pages/components/product-item.component.js';
import type { Product } from '../../models/product.model.js';
import productsData from '../../data/products.json' with { type: 'json' };

// Feature: Inventory

const PRODUCT_NAMES: string[] = Object.values(productsData.products).map((p: Product) => p.name);

test.describe('Products', { tag: '@regression' }, () => {
  // Rule: Cart badge reflects the number of products added

  test('updates the cart badge after adding all products', async ({ inventoryPage }) => {
    // Given the user is on the inventory page (inventoryPage fixture)
    // And the inventory contains N products
    const totalProducts: number = await inventoryPage.productList.getCount();

    // When the user adds all products to the cart
    await addProducts(inventoryPage, PRODUCT_NAMES);

    // Then the cart badge shows the total number of added products
    await expect(inventoryPage.header.cartItemsCount()).resolves.toBe(String(totalProducts));
  });

  // Rule: Products can be added to the cart individually
  test.describe('Add to Cart', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user is on the inventory page

    // Scenario Outline: adds <product> to the cart
    for (const name of PRODUCT_NAMES) {
      test(`adds "${name}" to the cart and updates the badge`, async ({ inventoryPage }) => {
        const product: ProductItemComponent = inventoryPage.productList.getProductByName(name);

        // When the user adds the product to the cart
        await product.addToCart();

        // Then the cart badge shows 1 and the remove button is enabled
        await expect(inventoryPage.header.cartItemsCount()).resolves.toBe('1');
        await expect(product.removeButton).toBeEnabled();
      });
    }
  });

  // Rule: Products can be removed from the cart individually
  test.describe('Remove from Cart', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user is on the inventory page
    //   And the product has been added to the cart

    // Scenario Outline: removes <product> from the cart
    for (const name of PRODUCT_NAMES) {
      test(`removes "${name}" from the cart and updates the badge`, async ({ inventoryPage }) => {
        const product: ProductItemComponent = inventoryPage.productList.getProductByName(name);
        await product.addToCart();

        // When the user removes the product from the cart
        await product.removeFromCart();

        // Then the cart badge is not visible and the add to cart button is enabled
        await expect(inventoryPage.header.cartCountBadge).not.toBeVisible();
        await expect(product.addToCartButton).toBeEnabled();
      });
    }
  });
});
