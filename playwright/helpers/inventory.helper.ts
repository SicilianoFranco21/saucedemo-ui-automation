import type { InventoryPage } from '../pages/inventory-page.js';

export async function addProducts(inventoryPage: InventoryPage, productNames: string[]): Promise<void> {
  for (const name of productNames) {
    await inventoryPage.productList.getProductByName(name).addToCart();
  }
}

export async function removeProducts(inventoryPage: InventoryPage, productNames: string[]): Promise<void> {
  for (const name of productNames) {
    await inventoryPage.productList.getProductByName(name).removeFromCart();
  }
}
