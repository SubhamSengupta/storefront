# ADR 0001 — Rendering strategy (ISR everywhere, path-based pagination)

**Status:** Accepted

## Context

The catalog data (DummyJSON) is effectively static — it changes rarely and is
the same for every visitor. We want fast first paint, low load on the upstream
API, good SEO, and correct HTTP semantics, while still demonstrating a strategy
that would scale to a large catalog.

Next.js 16 (App Router) offers static rendering, ISR, on-demand ISR, and dynamic
rendering. Two non-obvious constraints shaped the design:

1. **Reading `searchParams` opts a route into dynamic rendering.** A `?page=`
   pagination scheme would therefore make the home page dynamic (SSR on every
   request), _not_ ISR — silently defeating the caching story.
2. **`fetch` is uncached by default in Next 16**, and a route only becomes
   on-demand ISR if `generateStaticParams` returns `[]` — _omitting_ it makes
   the route dynamic.

## Decision

- **Catalog list — genuine ISR via path-based pagination.** Page 1 is the home
  route `/`; deeper pages are `/products/page/[page]`, prebuilt with
  `generateStaticParams` and `export const revalidate = 3600`. No route reads
  `searchParams`, so all list pages are statically prerendered and revalidated
  on a timer. URLs stay crawlable, shareable, and back-button-correct.
- **Product detail — on-demand ISR.** `/products/[id]` sets `revalidate` and
  returns `[]` from `generateStaticParams`: nothing is prebuilt, each product is
  generated and cached on first visit. This deliberately models the strategy a
  million-SKU catalog would use (prebuilding everything is infeasible at scale).
- **Data caching is explicit.** The API client passes `next: { revalidate }` on
  every fetch, so caching intent is visible at the call site rather than relying
  on default heuristics.
- **The cart is the only dynamic/client concern**, isolated to a client island
  (see ADR 0002).

The build output confirms the intent: `/` is `○ (Static)` and
`/products/page/[page]` is `● (SSG)` with a 1h revalidate — no route is dynamic
(`ƒ`).

## Consequences

- Fast TTFB and minimal upstream load; the API is hit on (re)generation, not per
  view.
- **Trade-off (detail cold start):** the first visit to an uncached product pays
  a live API round-trip. Full SSG over all 194 products would avoid this; we
  chose on-demand ISR to demonstrate the at-scale pattern and documented the
  cost. Switching to full SSG is a one-line change (return all ids from
  `generateStaticParams`).
- **Content-first, no route-level `loading.tsx`.** An early version used
  `loading.tsx` skeletons. Testing with JavaScript disabled revealed the
  problem: a route-level `loading.tsx` creates a Suspense boundary, so Next ships
  the _skeleton_ as the static shell and streams the real content into a block
  that only appears once JS runs the swap. Consequences: (1) with JS off — and
  for non-JS crawlers — the catalog showed only a skeleton; (2) the streaming
  shell forced `notFound()` to return HTTP **200** (a soft 404). Removing
  route-level loading makes the static/ISR HTML contain real content directly
  (crawlable, works without JS) **and** restores a true **HTTP 404** for invalid
  products. The cost — no skeleton during client-side navigation — is negligible
  for prerendered, prefetched pages. The `/cart` page is the deliberate exception
  (client-only, so it hydrates a skeleton).

## Alternatives considered

- **`?page=` query pagination** — rejected: forces dynamic rendering, breaking
  the ISR story (this was the key correction from an early design review).
- **Full SSG for detail** — viable at 194 products; rejected only to showcase
  the on-demand pattern, with the trade-off noted.
