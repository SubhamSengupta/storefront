import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streams on the first (cold) on-demand-ISR render of an uncached product, and
 * on client-side navigation into a product. Warm ISR hits serve full HTML.
 */
export default function ProductLoading() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-11 w-40" />
      </div>
    </div>
  );
}
