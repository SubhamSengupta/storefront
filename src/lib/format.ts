/**
 * Presentation helpers for money and discounts. Pure functions, kept separate
 * from `lib/utils.ts` (which holds the shadcn `cn` helper) so formatting logic
 * is independently unit-testable.
 */

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Format a number as a USD price string, e.g. `9.99` → `$9.99`. */
export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

/**
 * Apply a percentage discount to a price and round to cents.
 * e.g. `discountedPrice(9.99, 10.48)` → `8.94`.
 */
export function discountedPrice(
  price: number,
  discountPercentage: number,
): number {
  const discounted = price * (1 - discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
}

/** Round a rating to one decimal for display, e.g. `2.56` → `2.6`. */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
