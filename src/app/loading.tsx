import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

/**
 * Navigation-time fallback for the home catalog. On a hard load the page is
 * prerendered (no skeleton); this shows during client-side navigation to `/`.
 */
export default function HomeLoading() {
  return (
    <div className="space-y-8">
      <div className="bg-muted h-8 w-40 animate-pulse rounded-md" />
      <ProductGridSkeleton />
    </div>
  );
}
