import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function CatalogPageLoading() {
  return (
    <div className="space-y-8">
      <div className="bg-muted h-8 w-40 animate-pulse rounded-md" />
      <ProductGridSkeleton />
    </div>
  );
}
