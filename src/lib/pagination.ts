/**
 * Pure pagination helpers, kept framework-agnostic and unit-tested.
 */

/** URL for a catalog page. Page 1 is canonical at `/`; deeper pages are pathed. */
export function pageHref(page: number): string {
  return page <= 1 ? "/" : `/products/page/${page}`;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Compute the sequence of page numbers (with "ellipsis" gaps) to render for a
 * paginated control — the standard first/last + window-around-current pattern.
 *
 * @param current 1-indexed current page
 * @param total   total number of pages
 * @param siblings pages to show on each side of the current page
 */
export function getPageRange(
  current: number,
  total: number,
  siblings = 1,
): Array<number | "ellipsis"> {
  // first + last + current + (siblings on each side) + two ellipses
  const totalSlots = siblings * 2 + 5;
  if (total <= totalSlots) return range(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);

  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, siblings * 2 + 3), "ellipsis", total];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "ellipsis", ...range(total - (siblings * 2 + 2), total)];
  }
  return [1, "ellipsis", ...range(left, right), "ellipsis", total];
}
