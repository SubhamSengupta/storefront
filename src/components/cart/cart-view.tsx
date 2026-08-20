"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CartLineItem } from "./cart-line-item";
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/store/cart";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { formatPrice } from "@/lib/format";

/** Full cart page contents. Client component: the cart lives in localStorage. */
export function CartView() {
  const hasMounted = useHasMounted();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  // Until mounted, render a stable skeleton so server + first client render match.
  if (!hasMounted) return <CartViewSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  const count = selectTotalItems(items);
  const total = selectTotalPrice(items);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <section aria-label="Cart items">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="py-4 first:pt-0">
              <CartLineItem item={item} />
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mt-2"
          onClick={clear}
        >
          Clear cart
        </Button>
      </section>

      <aside aria-label="Order summary" className="h-fit rounded-xl border p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <Separator className="my-4" />
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Items ({count})</dt>
            <dd className="tabular-nums">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>Free</dd>
          </div>
        </dl>
        <Separator className="my-4" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
        <Button className="mt-6 w-full" size="lg" disabled>
          Checkout
        </Button>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Checkout is out of scope for this demo.
        </p>
      </aside>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <ShoppingBag className="text-muted-foreground size-12" />
      <div>
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-muted-foreground text-sm">
          Browse the catalog to add products.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Continue shopping
      </Link>
    </div>
  );
}

function CartViewSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex gap-3 py-4">
            <Skeleton className="size-16 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
