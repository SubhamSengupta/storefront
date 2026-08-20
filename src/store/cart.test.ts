import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore, selectTotalItems, selectTotalPrice } from "./cart";
import type { Product } from "@/lib/types/product";

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  ({
    id: 1,
    title: "Test Product",
    price: 10,
    thumbnail: "thumb.webp",
    ...overrides,
  }) as Product;

// The store is a module singleton; reset it (and its persisted copy) per test.
beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe("cart store", () => {
  it("adds a new product as a line item with quantity 1", () => {
    useCartStore.getState().addItem(makeProduct());
    expect(useCartStore.getState().items).toEqual([
      {
        id: 1,
        title: "Test Product",
        price: 10,
        thumbnail: "thumb.webp",
        quantity: 1,
      },
    ]);
  });

  it("merges quantity when the same product is added again", () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product, 2);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it("keeps distinct products as separate line items", () => {
    useCartStore.getState().addItem(makeProduct({ id: 1 }));
    useCartStore.getState().addItem(makeProduct({ id: 2 }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("removes a line item by id", () => {
    useCartStore.getState().addItem(makeProduct({ id: 1 }));
    useCartStore.getState().addItem(makeProduct({ id: 2 }));
    useCartStore.getState().removeItem(1);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(2);
  });

  it("updates quantity to an exact value", () => {
    useCartStore.getState().addItem(makeProduct());
    useCartStore.getState().updateQuantity(1, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("removes the line when quantity is set to zero or below", () => {
    useCartStore.getState().addItem(makeProduct());
    useCartStore.getState().updateQuantity(1, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clears the entire cart", () => {
    useCartStore.getState().addItem(makeProduct({ id: 1 }));
    useCartStore.getState().addItem(makeProduct({ id: 2 }));
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("persists items to localStorage", () => {
    useCartStore.getState().addItem(makeProduct());
    const persisted = localStorage.getItem("storefront.cart.v1");
    expect(persisted).toContain('"id":1');
    expect(persisted).toContain('"quantity":1');
  });
});

describe("cart selectors", () => {
  it("sums total units across line items", () => {
    const items = [
      { id: 1, title: "A", price: 10, thumbnail: "", quantity: 2 },
      { id: 2, title: "B", price: 5, thumbnail: "", quantity: 3 },
    ];
    expect(selectTotalItems(items)).toBe(5);
  });

  it("sums total price across line items", () => {
    const items = [
      { id: 1, title: "A", price: 10, thumbnail: "", quantity: 2 },
      { id: 2, title: "B", price: 5, thumbnail: "", quantity: 3 },
    ];
    expect(selectTotalPrice(items)).toBe(35);
  });
});
