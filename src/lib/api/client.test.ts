import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, ApiError } from "./client";
import { REVALIDATE_SECONDS } from "@/lib/constants";

function mockFetchOnce(
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

describe("apiFetch", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("returns parsed JSON on success", async () => {
    mockFetchOnce({ hello: "world" });
    await expect(apiFetch("/products")).resolves.toEqual({ hello: "world" });
  });

  it("builds an absolute URL with encoded query params", async () => {
    const fetchMock = mockFetchOnce({ ok: true });
    await apiFetch("/products", { searchParams: { limit: 12, skip: 24 } });

    const calledWith = fetchMock.mock.calls[0][0] as URL;
    expect(calledWith.toString()).toBe(
      "https://dummyjson.com/products?limit=12&skip=24",
    );
  });

  it("defaults to the ISR revalidate window", async () => {
    const fetchMock = mockFetchOnce({});
    await apiFetch("/products");

    const init = fetchMock.mock.calls[0][1] as RequestInit & {
      next?: { revalidate?: number | false };
    };
    expect(init.next?.revalidate).toBe(REVALIDATE_SECONDS);
  });

  it("allows overriding the revalidate window", async () => {
    const fetchMock = mockFetchOnce({});
    await apiFetch("/products", { revalidate: 0 });

    const init = fetchMock.mock.calls[0][1] as RequestInit & {
      next?: { revalidate?: number | false };
    };
    expect(init.next?.revalidate).toBe(0);
  });

  it("throws an ApiError carrying the HTTP status on failure", async () => {
    mockFetchOnce({ message: "Not found" }, { ok: false, status: 404 });

    await expect(apiFetch("/products/999999")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
    });
    await expect(apiFetch("/products/999999")).rejects.toBeInstanceOf(ApiError);
  });
});
