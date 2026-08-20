import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToCartButton } from "./add-to-cart-button";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/types/product";

const product = {
  id: 1,
  title: "Test Product",
  price: 10,
  thumbnail: "t.webp",
} as Product;

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe("AddToCartButton", () => {
  it("adds the product to the cart when clicked", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton product={product} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: 1, quantity: 1 });
  });

  it("confirms the addition visually and to assistive tech", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton product={product} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(screen.getByRole("button", { name: /added/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/added to cart/i);
  });
});
