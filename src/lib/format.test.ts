import { describe, it, expect } from "vitest";
import { formatPrice, discountedPrice, formatRating } from "./format";

describe("formatPrice", () => {
  it("formats whole and fractional dollars", () => {
    expect(formatPrice(9.99)).toBe("$9.99");
    expect(formatPrice(1000)).toBe("$1,000.00");
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("discountedPrice", () => {
  it("applies a percentage discount rounded to cents", () => {
    expect(discountedPrice(9.99, 10.48)).toBe(8.94);
  });

  it("returns the original price when there is no discount", () => {
    expect(discountedPrice(50, 0)).toBe(50);
  });

  it("handles a full discount", () => {
    expect(discountedPrice(20, 100)).toBe(0);
  });
});

describe("formatRating", () => {
  it("rounds to a single decimal place", () => {
    expect(formatRating(2.56)).toBe("2.6");
    expect(formatRating(5)).toBe("5.0");
  });
});
