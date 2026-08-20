import { describe, it, expect, vi, afterEach } from "vitest";
import { ApiError } from "./client";
import { getProductPage, getProduct, getTotalPages } from "./products";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

// These tests exercise the real apiFetch/ApiError by stubbing global fetch,
// so pagination maths and 404 handling are verified end-to-end through the
// actual client rather than a mocked seam.

function stubFetch(
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
) {
  const { ok = true, status = 200 } = init;
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as Response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("getProductPage", () => {
  it("translates a page number into the correct limit/skip", async () => {
    const fetchMock = stubFetch({
      products: [],
      total: 194,
      skip: 0,
      limit: 12,
    });
    await getProductPage(3);

    const url = fetchMock.mock.calls[0][0] as URL;
    expect(url.searchParams.get("limit")).toBe(String(PRODUCTS_PER_PAGE));
    expect(url.searchParams.get("skip")).toBe(String(PRODUCTS_PER_PAGE * 2));
  });

  it("computes totalPages from the reported total (ceil)", async () => {
    stubFetch({ products: [], total: 194, skip: 0, limit: 12 });
    const result = await getProductPage(1);

    // ceil(194 / 12) = 17
    expect(result.totalPages).toBe(17);
    expect(result.page).toBe(1);
    expect(result.total).toBe(194);
  });

  it("never reports fewer than one page for an empty catalog", async () => {
    stubFetch({ products: [], total: 0, skip: 0, limit: 12 });
    const result = await getProductPage(1);
    expect(result.totalPages).toBe(1);
  });
});

describe("getTotalPages", () => {
  it("derives the page count from the catalog total", async () => {
    stubFetch({ products: [], total: 194, skip: 0, limit: 1 });
    await expect(getTotalPages()).resolves.toBe(17);
  });
});

describe("getProduct", () => {
  it("returns the product on success", async () => {
    stubFetch({ id: 1, title: "Test" });
    await expect(getProduct(1)).resolves.toMatchObject({
      id: 1,
      title: "Test",
    });
  });

  it("returns null on a 404 so the caller can render not-found", async () => {
    stubFetch({ message: "not found" }, { ok: false, status: 404 });
    await expect(getProduct(999999)).resolves.toBeNull();
  });

  it("re-throws non-404 errors to the error boundary", async () => {
    stubFetch({ message: "boom" }, { ok: false, status: 500 });
    await expect(getProduct(1)).rejects.toBeInstanceOf(ApiError);
  });
});
