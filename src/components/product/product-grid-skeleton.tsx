import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

/** Placeholder grid shown as the route-level loading fallback for the catalog. */
export function ProductGridSkeleton({
  count = PRODUCTS_PER_PAGE,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
