/**
 * App-wide constants. Kept in one place so tuning cache/pagination behaviour
 * is a single-line change rather than a hunt across the codebase.
 */

/** Base URL for the DummyJSON REST API. */
export const API_BASE_URL = "https://dummyjson.com";

/** Products shown per catalog page. 12 tiles a 2/3/4-column grid cleanly. */
export const PRODUCTS_PER_PAGE = 12;

/**
 * ISR revalidation window (seconds) for catalog data. One hour follows the
 * Next.js guidance to prefer a high revalidation time for mostly-static data;
 * on-demand revalidation would be layered on top for a real store.
 */
export const REVALIDATE_SECONDS = 3600;

/** localStorage key for the persisted cart. Versioned to allow safe migrations. */
export const CART_STORAGE_KEY = "storefront.cart.v1";

/** Public site name, surfaced in the header and metadata. */
export const SITE_NAME = "Storefront";
