import { notFound } from "next/navigation";
import { getProductPage } from "@/lib/api/products";
import { ProductGrid } from "./product-grid";
import { Pagination } from "./pagination";

/**
 * Shared catalog view rendered by both `/` (page 1) and `/products/page/[page]`.
 * A server component: it fetches on the server via the cached API client, so the
 * whole thing is statically/ISR-rendered. Out-of-range pages 404.
 */
export async function Catalog({ page }: { page: number }) {
  const { products, total, totalPages } = await getProductPage(page);

  if (page > totalPages) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground text-sm">
          Page {page} of {totalPages} · {total} products
        </p>
      </div>

      <ProductGrid products={products} />

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
