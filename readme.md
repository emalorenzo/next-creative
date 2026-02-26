# next-creative

`next-creative` is a lite fork of Next.js focused on creative route transitions.

This repo is structured to keep rebases from upstream `next.js` simple:

- core fork changes live mainly in `packages/next`
- consumer-facing creative surface is `packages/next-creative`
- runnable demos live in `examples/`

## Clone and run

```bash
git clone https://github.com/emalorenzo/next-creative.git
cd next-creative
pnpm install
pnpm --filter=next build
pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
pnpm --dir examples/with-next-creative-studio dev
```

Open `http://localhost:3000`.

Shortcut commands from repo root:

```bash
pnpm dev:creative-example
pnpm build:creative-example
```

## Build pages from examples

Examples are standard App Router apps. Keep creating routes directly in `app/`:

- `app/contact/page.jsx` -> `/contact`
- `app/case-studies/page.jsx` -> `/case-studies`
- `app/case-studies/[slug]/page.jsx` -> dynamic routes

## Installing this fork from npm

```bash
npm i next-creative
```

Published packages:

- `next-creative@16.2.0-canary.62`
- `@emalorenzo/next@16.2.0-canary.62`

Local development in this repo still uses file deps in `examples/with-next-creative-studio`:

- `next` from `file:../../packages/next`
- `next-creative` from `file:../../packages/next-creative`

## Docs

- `docs/NEXT_CREATIVE_API.md`
- `docs/NEXT_CREATIVE_DOCS.md`
- `docs/NEXT_CREATIVE_EXAMPLES.md`
- `docs/PLAN.md`
- `docs/TASKS.md`
