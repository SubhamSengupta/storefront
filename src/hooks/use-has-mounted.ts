"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Returns `false` on the server and on the first client render, then `true`
 * after hydration. Implemented with `useSyncExternalStore` (server snapshot vs
 * client snapshot) rather than a setState-in-effect, so there's no cascading
 * re-render. Used to gate persisted-cart values behind hydration and avoid a
 * server/client mismatch.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
