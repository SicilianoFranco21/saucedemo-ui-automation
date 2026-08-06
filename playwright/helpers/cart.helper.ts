import type { CartPage } from '../playwright/pages/cart-page.js';

export async function removeProducts(cartPage: CartPage, productNames: string[]) {
  for (const name of productNames) {
    await cartPage.productList.getProductByName(name).removeFromCart();
  }
}
