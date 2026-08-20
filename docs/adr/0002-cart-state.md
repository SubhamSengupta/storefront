# ADR 0002 — Cart state: Zustand + localStorage with a hydration guard

**Status:** Accepted

## Context

The cart is the app's only genuinely stateful, client-side concern. It must:
add/remove items, expose an item count and total, and **persist across
reloads**. The rest of the app is server-rendered (ADR 0001), so the cart should
be an isolated client island, not a reason to make pages dynamic.

Two risks with client-persisted state under SSR:

- **Re-render scope:** a naive Context would re-render every consumer on any
  cart change (e.g. the header badge re-rendering on unrelated updates).
- **Hydration mismatch:** the server can't read `localStorage`, so it renders an
  empty cart; if the client's first render shows the persisted cart, React sees
  a mismatch.

## Decision

- **Zustand** with the `persist` middleware backed by `localStorage`
  (`partialize` stores only items, never the actions). Selector subscriptions
  mean a component re-renders only when the slice it selects changes — the
  header badge subscribes to the derived count alone.
- **Hydration guard via `useSyncExternalStore`** (`useHasMounted`): returns
  `false` on the server and first client render, then `true`. Cart-count UI is
  gated on it, so the server HTML and first client render agree, and the
  persisted count appears immediately after hydration. `useSyncExternalStore`
  is used instead of a `useState`+`useEffect` flag to avoid a cascading
  re-render (and it satisfies the `react-hooks` lint rule).
- **Pure selectors** (`selectTotalItems`, `selectTotalPrice`) are exported and
  unit-tested independently of React.

## Consequences

- Minimal re-renders; the cart is ~1 KB of state with no provider boilerplate.
- Cart survives reloads and browser restarts — this exceeds the literal
  "persist within the session" requirement (see the README trade-off on
  `localStorage` vs `sessionStorage`).
- The mount guard means the count is briefly absent on the very first paint
  (before hydration); this is intentional and imperceptible.

## Alternatives considered

- **React Context + `useReducer`** — no dependency, but manual re-render
  control (split contexts/memoization) and more boilerplate for the same result.
- **Redux Toolkit** — over-engineered for a single cart slice.
