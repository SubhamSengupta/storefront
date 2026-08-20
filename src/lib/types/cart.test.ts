import { describe, it, expect } from "vitest";
import { toCartItem } from "./cart";
import type { Product } from "./product";

const product = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  price: 9.99,
  thumbnail: "https://cdn.dummyjson.com/.../thumbnail.webp",
  description: "…",
  category: "beauty",
  discountPercentage: 10.48,
  rating: 2.56,
} as Product;

describe("toCartItem", () => {
  it("keeps only the fields the cart persists", () => {
    expect(toCartItem(product)).toEqual({
      id: 1,
      title: "Essence Mascara Lash Princess",
      price: 9.99,
      thumbnail: "https://cdn.dummyjson.com/.../thumbnail.webp",
      quantity: 1,
    });
  });

  it("defaults quantity to 1 but accepts an override", () => {
    expect(toCartItem(product, 3).quantity).toBe(3);
  });
});
