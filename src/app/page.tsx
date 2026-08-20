import { Catalog } from "@/components/product/catalog";

// Genuine ISR: this route reads no request-time input, so it prerenders and
// revalidates on a timer. 3600s = REVALIDATE_SECONDS (must be a static literal
// for route segment config). The route-level loading.tsx supplies the
// navigation-time fallback.
export const revalidate = 3600;

export default function HomePage() {
  return <Catalog page={1} />;
}
