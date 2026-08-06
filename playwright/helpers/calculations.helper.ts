import type { Product } from '../models/product.model.js';

export function calculateSubtotal(products: Product[]) {
  return products.reduce((total: number, product: Product) => total + product.price, 0);
}

export function calculateTax(subtotal: number) {
  return subtotal * 0.08;
}

export function calculateTotal(products: Product[]) {
  const subtotal = calculateSubtotal(products);
  return subtotal + calculateTax(subtotal);
}
