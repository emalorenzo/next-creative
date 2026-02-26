# next-creative

Creative-first Next.js fork for advanced page transitions (interruptible and non-interruptible) and WebGL/R3F-heavy sites.

## Quickstart (as a user)

Create a normal Next app, then install `next-creative`:

```bash
npx create-next-app@latest my-creative-site
cd my-creative-site
npm i next-creative
```

Use regular Next scripts (`next dev`, `next build`, `next start`) or call the provided binary explicitly:

```bash
npx next-creative dev
```

Creative navigation APIs:

```ts
import { useRouter, TransitionBoundary } from 'next-creative/navigation'
```

## Try the studio demo

```bash
git clone https://github.com/emalorenzo/next-creative.git
cd next-creative
pnpm install
pnpm --filter=next build
pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
pnpm --dir examples/with-next-creative-studio dev
```

Open `http://localhost:3000`.

## What this repo contains

- Core fork changes mainly in `packages/next`
- Public distribution wrapper in `packages/next-creative`
- Runnable demos in `examples/`

## Published packages

```bash
npm i next-creative
```

- `next-creative@16.2.0-canary.62`
- `@emalorenzo/next@16.2.0-canary.62`

## For maintainers of this fork

See [NEXT_CREATIVE_DEVELOPMENT.md](/Users/ema/Dev/next-creative-fork/docs/NEXT_CREATIVE_DEVELOPMENT.md) for local build, rebase flow, and publish workflow.

## Docs

- `docs/NEXT_CREATIVE_API.md`
- `docs/NEXT_CREATIVE_DEVELOPMENT.md`
- `docs/NEXT_CREATIVE_DOCS.md`
- `docs/NEXT_CREATIVE_EXAMPLES.md`
- `docs/PLAN.md`
- `docs/TASKS.md`
