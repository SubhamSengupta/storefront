import { API_BASE_URL, REVALIDATE_SECONDS } from "@/lib/constants";

/**
 * Error thrown for non-2xx API responses. Carries the HTTP status so callers
 * can branch on it (e.g. treat 404 as "not found" rather than a hard failure).
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiFetchOptions {
  /**
   * ISR revalidation window in seconds, or `false` to cache indefinitely.
   * Defaults to REVALIDATE_SECONDS. Fetches are cached by default (opting into
   * Next.js static/ISR rendering) — pass `0` only if a route must be dynamic.
   */
  revalidate?: number | false;
  /** Query params appended to the path. */
  searchParams?: Record<string, string | number>;
}

/**
 * Single choke point for every outbound DummyJSON call.
 *
 * Centralising fetch here means URL construction, caching policy, JSON parsing,
 * and error normalisation live in exactly one place — so pages/components never
 * touch `fetch` directly and the whole data layer is trivial to mock in tests
 * or swap for a different backend.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { revalidate = REVALIDATE_SECONDS, searchParams } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: { accept: "application/json" },
    // `next.revalidate` opts this fetch into the Data Cache with a time-based
    // window. Combined with a route-level `revalidate` export this is what
    // makes catalog pages statically/ISR-rendered instead of dynamic.
    next: { revalidate },
  });

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
