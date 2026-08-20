/**
 * TypeScript models for the DummyJSON product API.
 *
 * These are hand-written to mirror the live response shape (verified against
 * https://dummyjson.com/products/1). We deliberately do not runtime-validate
 * responses (see docs/adr/0003-data-layer.md for the trade-off): a breaking
 * change in the upstream shape would surface as a render error rather than a
 * typed boundary failure. Centralising the models here keeps that easy to
 * revisit (e.g. swap in Zod-inferred types) without touching call sites.
 */

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  /** Absent on a handful of DummyJSON products, so intentionally optional. */
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

/** Envelope returned by the list/search endpoints. */
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
