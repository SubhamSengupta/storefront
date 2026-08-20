import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Product, ProductsResponse } from "@/lib/types/product";
import { apiFetch, ApiError } from "./client";

/** Result of a single catalog page fetch, with pagination maths resolved. */
export interface ProductPage {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/** Low-level list fetch (limit/skip). Prefer `getProductPage` in pages. */
export async function getProducts(params: {
  limit: number;
  skip: number;
}): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>("/products", {
    searchParams: { limit: params.limit, skip: params.skip },
  });
}

/**
 * Fetch one page of the catalog (1-indexed) and resolve pagination metadata.
 * Encapsulates the limit/skip ↔ page-number translation in one tested place.
 */
export async function getProductPage(page: number): Promise<ProductPage> {
  const skip = (page - 1) * PRODUCTS_PER_PAGE;
  const data = await getProducts({ limit: PRODUCTS_PER_PAGE, skip });
  const totalPages = Math.max(1, Math.ceil(data.total / PRODUCTS_PER_PAGE));
  return { products: data.products, total: data.total, page, totalPages };
}

/** Total number of pages in the catalog — used by `generateStaticParams`. */
export async function getTotalPages(): Promise<number> {
  const data = await apiFetch<ProductsResponse>("/products", {
    searchParams: { limit: 1, select: "id" },
  });
  return Math.max(1, Math.ceil(data.total / PRODUCTS_PER_PAGE));
}

/**
 * Fetch a single product by id. Returns `null` on 404 so callers can render a
 * proper not-found page; any other failure propagates to the error boundary.
 */
export async function getProduct(id: string | number): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
