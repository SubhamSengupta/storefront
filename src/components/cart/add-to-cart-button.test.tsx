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

  it("swaps the button for a quantity stepper once in the cart", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton product={product} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    // Add button is gone; stepper shows quantity 1.
    expect(
      screen.queryByRole("button", { name: /add to cart/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/1 item in cart/i);

    // Increase → 2.
    await user.click(
      screen.getByRole("button", { name: /increase quantity/i }),
    );
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("removes the item and restores the button when decreased to zero", async () => {
    const user = userEvent.setup();
    useCartStore.setState({
      items: [
        {
          id: 1,
          title: "Test Product",
          price: 10,
          thumbnail: "t.webp",
          quantity: 1,
        },
      ],
    });
    render(<AddToCartButton product={product} />);

    await user.click(
      screen.getByRole("button", { name: /decrease quantity/i }),
    );

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });
});
