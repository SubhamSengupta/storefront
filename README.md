# Storefront

A small, production-shaped e-commerce demo built with **Next.js 16 (App Router)**
and the [DummyJSON](https://dummyjson.com) API. It’s intentionally scoped to four
pages, but the engineering around them — rendering strategy, state, testing,
CI — is meant to reflect how I’d build the real thing.

> **Live demo:** _add your Vercel URL here after deploying_

---

## Features

| Requirement         | Implementation                                                                   |
| ------------------- | -------------------------------------------------------------------------------- |
| Home / product list | ISR catalog with image, title, price, rating; path-based pagination              |
| Product detail      | `/products/[id]` — gallery, title, description, price, discount %, rating        |
| Cart                | Add/remove, quantity, item count, total; slide-out drawer **and** a `/cart` page |
| Persistence         | `localStorage` via Zustand `persist` (survives reloads), hydration-safe          |
| Navigation          | Header with site name + cart icon showing a live item count                      |

Plus: streaming loading skeletons, error & not-found boundaries, per-product SEO
metadata (Open Graph), an accessibility pass, unit/component/E2E tests, and CI.

## Tech stack

- **Next.js 16** App Router (React Server Components, ISR) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives)
- **Zustand** (cart state + `localStorage` persistence)
- **Vitest** + **React Testing Library** · **Playwright** (E2E)
- **ESLint** (Next core-web-vitals + jsx-a11y) · **Prettier** · **Husky** + **lint-staged**
- **Yarn 4** (Berry, `node-modules` linker) · **GitHub Actions** CI

## Getting started

**Prerequisites:** Node.js ≥ 20 and [Corepack](https://nodejs.org/api/corepack.html)
(bundled with Node) to pin Yarn 4.

```bash
corepack enable           # activates the Yarn 4 version pinned in package.json
yarn install
yarn dev                  # http://localhost:3000
```

### Scripts

| Script            | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `yarn dev`        | Start the dev server                            |
| `yarn build`      | Production build                                |
| `yarn start`      | Serve the production build                      |
| `yarn lint`       | ESLint (incl. accessibility rules)              |
| `yarn typecheck`  | `tsc --noEmit`                                  |
| `yarn test`       | Unit + component tests (Vitest)                 |
| `yarn test:watch` | Vitest in watch mode                            |
| `yarn test:e2e`   | Playwright E2E (needs network for the live API) |
| `yarn format`     | Prettier write                                  |

## Architecture

### Rendering strategy

The catalog is effectively static, so it’s served statically and revalidated on a
timer; the cart is the only client state, isolated to a small client island.

| Route                   | Rendering         | Why                                                            |
| ----------------------- | ----------------- | -------------------------------------------------------------- |
| `/` (page 1)            | **ISR** (1h)      | Static + revalidate; no `searchParams`, so it stays static     |
| `/products/page/[page]` | **ISR / SSG**     | `generateStaticParams` prebuilds pages 2..N + revalidate       |
| `/products/[id]`        | **On-demand ISR** | `generateStaticParams: []` → generated & cached on first visit |
| `/cart`                 | Static shell      | Cart hydrates from `localStorage` on the client                |

Pagination is **path-based** (`/products/page/2`), not `?page=`, specifically so
the list stays statically renderable — reading `searchParams` would force dynamic
rendering. See [ADR 0001](docs/adr/0001-rendering-strategy.md).

Loading UI is **navigation-time, not initial-load**: because catalog pages are
prerendered, a hard load sends complete HTML with no skeleton; `loading.tsx`
provides the instant loading state during client-side navigation (and the cold
first render of an uncached product).

### Project structure

```
src/
├─ app/
│  ├─ page.tsx                     # Home = product list page 1 (ISR)
│  ├─ loading.tsx / error.tsx      # Route boundaries
│  ├─ products/
│  │  ├─ page/[page]/              # Path-based pagination (ISR + generateStaticParams)
│  │  └─ [id]/                     # Detail (on-demand ISR, generateMetadata, not-found)
│  └─ cart/page.tsx               # Full cart page
├─ components/{product,cart,layout,ui}/
├─ lib/{api,types}/ · format.ts · pagination.ts   # Typed API client + pure helpers
├─ store/cart.ts                  # Zustand store (+ persist)
└─ hooks/use-has-mounted.ts       # Hydration guard (useSyncExternalStore)
```

### Key decisions & trade-offs

Documented as short ADRs in [`docs/adr/`](docs/adr):

- [0001 — Rendering strategy](docs/adr/0001-rendering-strategy.md) (ISR, path-based pagination)
- [0002 — Cart state](docs/adr/0002-cart-state.md) (Zustand + localStorage + hydration guard)
- [0003 — Data layer](docs/adr/0003-data-layer.md) (typed client; the no-Zod trade-off)
- [0004 — Tooling & scope](docs/adr/0004-tooling-and-scope.md) (what’s included and deliberately not)

Highlights:

- **On-demand ISR for detail** models a large catalog; the cost is a cold first
  visit per product. Full SSG would be strictly faster at 194 products and is a
  one-line change — kept as a conscious demonstration.
- **`localStorage`, not `sessionStorage`** — the spec says “persist within the
  session”; a cart that survives reloads is better UX, so the requirement is read
  as a floor.
- **No runtime response validation** — lighter, but an upstream shape change would
  surface as a render error; centralized parsing keeps Zod an easy future add.

### Accessibility

Semantic landmarks and headings, a skip-to-content link, keyboard-operable cart
drawer and pagination (Radix + real `<Link>`s), `aria-live` confirmation on
add-to-cart, image `alt` text, and labelled icon buttons. `eslint-plugin-jsx-a11y`
(recommended) runs in lint and CI.

### Testing

- **Unit** — API client (mocked `fetch`), pagination maths, price/discount
  formatting, cart store actions & selectors.
- **Component** — ProductCard, Pagination, AddToCartButton (React Testing Library).
- **E2E** — one Playwright golden path: browse → product → add to cart → see the
  count → view the cart → **reload persists**; plus an invalid-id not-found check.

```bash
yarn test          # unit + component
yarn test:e2e      # Playwright (starts the app automatically)
```

## Known limitations

- **Invalid product → HTTP 200 (soft 404).** The not-found UI renders correctly
  with a `noindex` meta, but the status is 200, not 404. This is documented
  Next.js behavior: a route-level `loading.tsx` (and RSC streaming generally)
  flushes the response before `notFound()` runs, so the status can’t be changed.
  Getting a hard 404 would mean giving up streaming on that route.
- **E2E depends on the live DummyJSON API.** Server-side rendering fetches the
  real API, which Playwright can’t intercept (those requests originate on the
  Next server, not the browser), so the E2E needs network access.
- **No runtime validation** of API responses (see ADR 0003).
- **Checkout is out of scope** — the cart total and a disabled Checkout button are
  shown, but there is no payment flow.

## Deployment

Deploys cleanly to **Vercel** (zero config). Set `NEXT_PUBLIC_SITE_URL` to the
deployed origin so Open Graph/canonical URLs are absolute. CI
(`.github/workflows/ci.yml`) runs lint, typecheck, tests, build, and E2E on every
push and PR.

---

Product data © [DummyJSON](https://dummyjson.com). Built as an architecture
assessment.
