import { test, expect } from "@playwright/test";

/**
 * The core shopping flow, end to end:
 * browse → open a product → add to cart → see the count → view the cart →
 * confirm it persists across a reload.
 */
test("browse, add to cart, view cart, and persist across reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

  // Open the first product from the grid.
  const firstProduct = page.locator("main ul > li a").first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();
  await expect(page).toHaveURL(/\/products\/\d+/);

  // The detail page shows the required fields.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const addToCart = page.getByRole("button", { name: /add to cart/i });
  await expect(addToCart).toBeVisible();

  // Add to cart → the header cart trigger reflects one item.
  await addToCart.click();
  const cartTrigger = page.getByRole("button", { name: /open cart/i });
  await expect(cartTrigger).toHaveAccessibleName(/1 item/i);

  // Open the drawer and go to the full cart page.
  await cartTrigger.click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await drawer.getByRole("link", { name: /view cart/i }).click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByText(/total/i).first()).toBeVisible();

  // Reload → cart persists (localStorage).
  await page.reload();
  await expect(
    page.getByRole("button", { name: /open cart/i }),
  ).toHaveAccessibleName(/1 item/i);
});

test("an invalid product id returns 404 and renders the not-found page", async ({
  page,
}) => {
  const response = await page.goto("/products/999999");
  expect(response?.status()).toBe(404);
  // Scope to <main> so we don't also match the document <title>.
  await expect(
    page.locator("main").getByText(/product not found/i),
  ).toBeVisible();
});
