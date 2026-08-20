import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/products";
import { ProductDetail } from "@/components/product/product-detail";

// On-demand ISR (see docs/adr/0001-rendering-strategy.md): 3600s = REVALIDATE_SECONDS.
export const revalidate = 3600;

/**
 * Return an empty array — critically, NOT omitting this function. Per the Next
 * docs, returning `[]` keeps the route statically generated on-demand (first
 * visit renders + caches); omitting it entirely would make the route dynamic.
 * Nothing is prebuilt, modelling a large-catalog "generate on demand" strategy.
 */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product not found" };
  }

  const description = product.description.slice(0, 160);
  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      images: [{ url: product.thumbnail, alt: product.title }],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Memoized with the generateMetadata fetch above — one network call per request.
  const product = await getProduct(id);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
