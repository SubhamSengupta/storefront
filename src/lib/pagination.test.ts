import { describe, it, expect } from "vitest";
import { pageHref, getPageRange } from "./pagination";

describe("pageHref", () => {
  it("maps page 1 to the canonical home URL", () => {
    expect(pageHref(1)).toBe("/");
    expect(pageHref(0)).toBe("/");
  });

  it("maps deeper pages to a path segment", () => {
    expect(pageHref(2)).toBe("/products/page/2");
    expect(pageHref(17)).toBe("/products/page/17");
  });
});

describe("getPageRange", () => {
  it("lists every page when the total fits without ellipses", () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("shows a trailing ellipsis near the start", () => {
    expect(getPageRange(2, 17)).toEqual([1, 2, 3, 4, 5, "ellipsis", 17]);
  });

  it("shows a leading ellipsis near the end", () => {
    expect(getPageRange(17, 17)).toEqual([1, "ellipsis", 13, 14, 15, 16, 17]);
  });

  it("shows ellipses on both sides in the middle", () => {
    expect(getPageRange(9, 17)).toEqual([
      1,
      "ellipsis",
      8,
      9,
      10,
      "ellipsis",
      17,
    ]);
  });
});
