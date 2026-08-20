# ADR 0004 — Tooling and scope calibration

**Status:** Accepted

## Context

The brief describes a "simple" e-commerce app but the goal is to showcase
engineering judgment. That cuts both ways: enough tooling to look production-
shaped, but not so much that it reads as cargo-culting on a four-page app.

## Decision

**Included**

- **Yarn Berry (v4), `node-modules` linker.** Modern Yarn (Corepack-pinned,
  strict lockfile) with a conventional `node_modules` tree, so Next.js, shadcn,
  and Playwright work with zero Plug'n'Play shims. `.yarnrc.yml` and the Yarn
  release binary are committed for reproducibility.
- **TypeScript (strict), Tailwind v4, shadcn/ui (Radix primitives).** Accessible
  components (e.g. the `Sheet` cart drawer) for near-free.
- **Testing pyramid:** Vitest + React Testing Library for logic and components,
  one Playwright E2E for the golden path. High signal, proportionate coverage.
- **Hygiene + CI:** ESLint (Next core-web-vitals + jsx-a11y), Prettier, Husky +
  lint-staged pre-commit, and GitHub Actions running
  lint → typecheck → test → build → E2E.

**Deliberately excluded**

- **Storybook** — a component workshop for ~3 presentational components on an app
  where UI is explicitly not the focus would be over-engineering; RTL tests
  already document component states.
- **commitlint / Conventional-Commit enforcement** — team process with no team.
  Husky + lint-staged (the genuinely useful local guard) is kept.
- **Runtime response validation (Zod)** — see ADR 0003.
- **Lighthouse-CI performance budget** — noted as a natural extension.

## Consequences

- The repo reads as production-shaped without ceremony that a reviewer would
  question. Each exclusion is a deliberate, defensible scope call rather than an
  omission.

## Note

This project was planned decision-by-decision and then run through an adversarial
design review before implementation. That review caught the `searchParams`/ISR
contradiction (ADR 0001) and trimmed the original scope (Storybook, commitlint,
one-ADR-per-decision) down to what's here.
