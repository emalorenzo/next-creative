# next-creative

`next-creative` is a lite fork of Next.js focused on creative route transitions and choreography.

This repository contains:

- the framework source (`packages/next`) with creative transition hooks
- the `packages/next-creative` package
- docs for API/design/plan under `docs/NEXT_CREATIVE_*`
- runnable examples under `examples/`

## Quick start

```bash
git clone https://github.com/emalorenzo/next-creative.git
cd next-creative
corepack pnpm install
```

## Run an example

Build local Next.js first, then run any example:

```bash
corepack pnpm --filter=next build
corepack pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
corepack pnpm --dir examples/with-next-creative-studio dev
```

Open `http://localhost:3000`.

You can do the same with other examples by changing the directory:

```bash
corepack pnpm --dir examples/<another-example> install --ignore-workspace --lockfile=false
corepack pnpm --dir examples/<another-example> dev
```

## Keep building pages from examples

Inside an example app (for example `examples/with-next-creative-studio`), edit files in `app/` and create new routes the same way as any App Router project:

- `app/page.jsx` for `/`
- `app/about/page.jsx` for `/about`
- `app/blog/[slug]/page.jsx` for dynamic routes

## Use this fork in another app (without npm publish)

This fork is not published to npm yet. Use local packing:

```bash
corepack pnpm --filter=next build
corepack pnpm pack-next
```

Then install the generated tarball in your app (path printed by `pack-next`).

## Useful docs

- `docs/NEXT_CREATIVE_API.md`
- `docs/NEXT_CREATIVE_DOCS.md`
- `docs/NEXT_CREATIVE_EXAMPLES.md`
- `docs/PLAN.md`
- `docs/TASKS.md`
