"use client";

import { Badge } from "@/components/ui/badge";
import { useCartStore, selectTotalItems } from "@/store/cart";
import { useHasMounted } from "@/hooks/use-has-mounted";

/**
 * The count bubble over the cart icon. Renders nothing until mounted so the
 * server HTML (which can't see localStorage) matches the first client render;
 * the persisted count then appears immediately after hydration.
 */
export function CartBadge() {
  const hasMounted = useHasMounted();
  const count = useCartStore((state) => selectTotalItems(state.items));

  if (!hasMounted || count === 0) return null;

  return (
    <Badge
      className="absolute -end-1 -top-1 size-5 justify-center rounded-full px-1 tabular-nums"
      aria-hidden="true"
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
