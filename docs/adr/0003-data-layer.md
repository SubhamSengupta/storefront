# ADR 0003 — Data layer: centralized typed client, no runtime validation

**Status:** Accepted

## Context

Every page reads from the DummyJSON API. We want one place that owns URL
construction, caching policy, error handling, and JSON parsing — so components
never touch `fetch` directly and the data surface is easy to test or swap.

A separate question is whether to **runtime-validate** responses (e.g. with
Zod). This is a third-party API, so its shape is not guaranteed.

## Decision

- **A single typed client** (`lib/api/client.ts` + `lib/api/products.ts`).
  `apiFetch<T>()` is the only place `fetch` is called; product functions
  (`getProductPage`, `getProduct`, `getTotalPages`) are thin, typed wrappers.
  `getProduct` maps a 404 to `null` so pages can call `notFound()`; other errors
  propagate to the route error boundary.
- **Hand-written TypeScript models** mirroring the live response shape, with
  **no runtime validation**.

## Consequences

- Pages/components depend only on typed functions; the API is trivial to mock
  (unit tests stub `fetch` and exercise the real client).
- Pagination maths (page ↔ limit/skip, total pages) lives in one tested place.
- **Trade-off:** without runtime validation, a breaking change in the upstream
  response would surface as a render error rather than a clean, localized
  boundary failure. This is an accepted risk for a demo against a stable API.
  Because parsing is centralized, adding Zod later — and _deriving_ the TS types
  from the schemas — is a contained change at the client boundary.

## Alternatives considered

- **Zod at the boundary** — the more defensive choice, and the natural next step
  if this were a production integration; deferred here to keep the dependency and
  code surface minimal for the assessment’s scope.
- **Inline `fetch` in each component** — rejected: duplicates URL/error logic and
  is hard to test.
