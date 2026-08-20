import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getTotalPages } from "@/lib/api/products";
import { apiFetch } from "@/lib/api/client";
import { pageHref } from "@/lib/pagination";
import type { ProductsResponse } from "@/lib/types/product";

/**
 * Generated at build/revalidate time: every catalog page plus every product
 * detail page. The cart is excluded (see robots.ts).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const totalPages = await getTotalPages();
  const catalogPages: MetadataRoute.Sitemap = Array.from(
    { length: totalPages },
    (_, index) => ({
      url: `${base}${pageHref(index + 1)}`,
      changeFrequency: "daily",
      priority: index === 0 ? 1 : 0.6,
    }),
  );

  // limit=0 returns the full catalog; select=id keeps the payload minimal.
  const { products } = await apiFetch<ProductsResponse>("/products", {
    searchParams: { limit: 0, select: "id" },
  });
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...catalogPages, ...productPages];
}
