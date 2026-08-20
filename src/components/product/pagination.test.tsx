import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders nothing when there is a single page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page and disables previous on page 1", () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByRole("link", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByLabelText("Previous page")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("links pages to the correct hrefs (page 1 is canonical /)", () => {
    render(<Pagination currentPage={2} totalPages={5} />);

    expect(screen.getByRole("link", { name: "Page 1" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "href",
      "/products/page/3",
    );
  });
});
