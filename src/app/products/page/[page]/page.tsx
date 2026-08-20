import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getTotalPages } from "@/lib/api/products";
import { Catalog } from "@/components/product/catalog";

// Genuine ISR (see docs/adr/0001-rendering-strategy.md): 3600s = REVALIDATE_SECONDS.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return { title: `Products — Page ${page}` };
}

/**
 * Prebuild pages 2..N at build time (page 1 is canonical at `/`). The catalog is
 * small enough to prerender every page; pages beyond this set (if the catalog
 * grows) are generated on-demand thanks to the default `dynamicParams: true`.
 */
export async function generateStaticParams() {
  const totalPages = await getTotalPages();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) notFound();
  // Collapse /products/page/1 onto the canonical home URL.
  if (pageNumber === 1) redirect("/");

  return <Catalog page={pageNumber} />;
}
