"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types/cart";

interface CartLineItemProps {
  item: CartItem;
  /** Called when a product link is followed (e.g. to close the drawer). */
  onNavigate?: () => void;
}

/** A single editable cart row. Reused in the drawer and the full cart page. */
export function CartLineItem({ item, onNavigate }: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-3">
      <Link
        href={`/products/${item.id}`}
        onClick={onNavigate}
        className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-md"
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/products/${item.id}`}
          onClick={onNavigate}
          className="line-clamp-2 text-sm font-medium hover:underline"
        >
          {item.title}
        </Link>
        <span className="text-muted-foreground text-sm">
          {formatPrice(item.price)}
        </span>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <div
            className="flex items-center rounded-md border"
            role="group"
            aria-label={`Quantity for ${item.title}`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label={`Decrease quantity of ${item.title}`}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.title}`}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive size-8"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <span className="text-sm font-semibold tabular-nums">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}
