"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useHasMounted } from "@/hooks/use-has-mounted";
import type { Product } from "@/lib/types/product";

interface AddToCartButtonProps {
  product: Product;
}

/**
 * Shows "Add to cart" until the product is in the cart, then swaps to a quantity
 * stepper (− count +). Decreasing to zero removes the item and restores the
 * button. Quantity is gated on hydration so the server render (empty cart) and
 * the first client render agree.
 */
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const hasMounted = useHasMounted();
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const storedQuantity = useCartStore(
    (state) =>
      state.items.find((item) => item.id === product.id)?.quantity ?? 0,
  );
  const quantity = hasMounted ? storedQuantity : 0;

  if (quantity === 0) {
    return (
      <Button
        size="lg"
        onClick={() => addItem(product)}
        className="w-full sm:w-auto"
      >
        <ShoppingCart className="size-4" /> Add to cart
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center rounded-md border"
        role="group"
        aria-label={`Quantity for ${product.title}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label={`Decrease quantity of ${product.title}`}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-12 text-center text-base font-medium tabular-nums">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          onClick={() => updateQuantity(product.id, quantity + 1)}
          aria-label={`Increase quantity of ${product.title}`}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <span className="text-muted-foreground text-sm">In cart</span>
      {/* Announce quantity changes to assistive tech. */}
      <span role="status" aria-live="polite" className="sr-only">
        {quantity} {quantity === 1 ? "item" : "items"} in cart
      </span>
    </div>
  );
}
