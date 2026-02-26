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
corepack pnpm install
corepack pnpm --filter=next build
corepack pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
corepack pnpm --dir examples/with-next-creative-studio dev
```

Open `http://localhost:3000`.

Shortcut commands from repo root:

```bash
corepack pnpm dev:creative-example
corepack pnpm build:creative-example
```

## Build pages from examples

Examples are standard App Router apps. Keep creating routes directly in `app/`:

- `app/contact/page.jsx` -> `/contact`
- `app/case-studies/page.jsx` -> `/case-studies`
- `app/case-studies/[slug]/page.jsx` -> dynamic routes

## Installing this fork from npm (target)

Goal UX:

```bash
npm i next-creative
```

Current status:

- `packages/next-creative` is prepared as the public wrapper package.
- For local development in this repo, examples consume:
  - `next` from `file:../../packages/next`
  - `next-creative` from `file:../../packages/next-creative`

To complete npm-only install for external users, publish workflow needs:

1. publish forked core build as an npm package (kept in sync with `packages/next`)
2. wire `next-creative` to that published core package
3. keep CLI compatibility (`next` bin) and creative exports (`next-creative/navigation`)

## Docs

- `docs/NEXT_CREATIVE_API.md`
- `docs/NEXT_CREATIVE_DOCS.md`
- `docs/NEXT_CREATIVE_EXAMPLES.md`
- `docs/PLAN.md`
- `docs/TASKS.md`
