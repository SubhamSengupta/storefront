"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartBadge } from "./cart-badge";
import { CartLineItem } from "./cart-line-item";
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/store/cart";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { formatPrice } from "@/lib/format";

/**
 * Slide-out cart "quick view" triggered from the header. The full cart page
 * (/cart) remains the canonical view; this drawer is a convenience layer.
 */
export function CartSheet() {
  const [open, setOpen] = useState(false);
  const hasMounted = useHasMounted();
  const items = useCartStore((state) => state.items);

  // Gate on mount so the trigger's aria-label matches between server and client.
  const count = hasMounted ? selectTotalItems(items) : 0;
  const total = selectTotalPrice(items);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
        >
          <ShoppingCart className="size-5" />
          <CartBadge />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
        </SheetHeader>

        {!hasMounted ? null : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <ShoppingCart className="text-muted-foreground size-10" />
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
          </div>
        ) : (
          <ul className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
            {items.map((item) => (
              <li key={item.id}>
                <CartLineItem item={item} onNavigate={close} />
              </li>
            ))}
          </ul>
        )}

        {hasMounted && items.length > 0 && (
          <SheetFooter>
            <Separator className="mb-2" />
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {count} {count === 1 ? "item" : "items"}
              </span>
              <span className="text-base font-semibold tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={close}
              className={buttonVariants({ variant: "default" })}
            >
              View cart &amp; checkout
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
