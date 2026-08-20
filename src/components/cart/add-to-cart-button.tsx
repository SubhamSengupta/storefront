"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/types/product";

interface AddToCartButtonProps {
  product: Product;
}

/** Adds a product to the cart with brief visual + screen-reader confirmation. */
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Clear a pending "Added" reset if the button unmounts first.
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleAdd() {
    addItem(product);
    setJustAdded(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <>
      <Button size="lg" onClick={handleAdd} className="w-full sm:w-auto">
        {justAdded ? (
          <>
            <Check className="size-4" /> Added
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" /> Add to cart
          </>
        )}
      </Button>
      {/* Announce the change to assistive tech without a visible duplicate. */}
      <span role="status" aria-live="polite" className="sr-only">
        {justAdded ? `${product.title} added to cart` : ""}
      </span>
    </>
  );
}
