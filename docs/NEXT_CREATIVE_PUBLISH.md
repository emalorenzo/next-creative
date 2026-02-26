# NEXT_CREATIVE_PUBLISH

Release workflow goal: keep upstream rebases simple and isolate publish logic.

## Principles

- Keep framework deltas in `packages/next` minimal and explicit.
- Keep distribution logic in `packages/next-creative`.
- Avoid deep changes to upstream release scripts unless required.

## Current local-dev model

- Example apps depend on local files:
  - `next` from `packages/next`
  - `next-creative` from `packages/next-creative`
- This guarantees demos use forked runtime, not npm upstream `next`.

## Target npm model

1. Publish a forked core package from `packages/next`.
2. Point `next-creative` to that published core package.
3. Publish `next-creative`.

## Rebase-friendly checklist

After rebasing from upstream:

1. Re-run tests for creative transition hooks.
2. Build `packages/next`.
3. Run `examples/with-next-creative-studio`.
4. Verify `packages/next-creative` exports and CLI wrapper still resolve.

## Minimal smoke commands

```bash
pnpm --filter=next build
pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
pnpm --dir examples/with-next-creative-studio dev
```
