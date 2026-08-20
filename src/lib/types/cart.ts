import type { Product } from "./product";

/**
 * A cart line item. We store only the fields the cart UI needs rather than the
 * whole Product, so the persisted localStorage payload stays small and stable
 * even if the upstream Product shape grows.
 */
export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

/** Narrow a full Product down to the snapshot the cart persists. */
export function toCartItem(product: Product, quantity = 1): CartItem {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    quantity,
  };
}
