# NEXT_CREATIVE_DEVELOPMENT

Guide for contributors maintaining the fork itself (not library consumers).

## Local setup

```bash
git clone https://github.com/emalorenzo/next-creative.git
cd next-creative
pnpm install
pnpm --filter=next build
```

Run the main demo:

```bash
pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
pnpm --dir examples/with-next-creative-studio dev
```

## Repo model

- `packages/next`: forked Next.js core
- `packages/next-creative`: public wrapper package
- `examples/with-next-creative-studio`: reference app

Local demo dependencies are file-based:

- `next` -> `file:../../packages/next`
- `next-creative` -> `file:../../packages/next-creative`

## Rebase workflow

1. Rebase from upstream `next.js`.
2. Build core: `pnpm --filter=next build`.
3. Run demo and validate transitions.
4. Re-run creative test/smoke cases.

## Publish workflow

1. Publish scoped core package (`@emalorenzo/next`) with a new version.
2. Update `packages/next-creative` dependency to the same version.
3. Publish `next-creative`.

If npm provenance causes issues in local publishing context, use:

```bash
npm publish --access public --ignore-scripts --no-provenance
```

Related: `docs/NEXT_CREATIVE_PUBLISH.md`.
