import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types/product";

const product = {
  id: 5,
  title: "Cool Widget",
  price: 19.99,
  rating: 4.2,
  thumbnail: "https://cdn.dummyjson.com/product-images/x/thumbnail.webp",
} as Product;

describe("ProductCard", () => {
  it("shows the title and price and links to the detail page", () => {
    render(<ProductCard product={product} />);

    expect(
      screen.getByRole("heading", { name: "Cool Widget" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/products/5");
  });

  it("exposes an accessible rating and image alt text", () => {
    render(<ProductCard product={product} />);

    expect(
      screen.getByRole("img", { name: /rated 4.2 out of 5/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Cool Widget")).toBeInTheDocument();
  });
});
