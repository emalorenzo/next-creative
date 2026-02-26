# with-next-creative-studio

Creative App Router transitions with a persistent WebGL stage (R3F + Drei).

This example demonstrates practical creative-navigation flows for a studio site:

- interruption-safe exits (`interrupt`) without stale completion callbacks
- directional back/forward choreography (`transition.direction`)
- persistent layout with independent content and modal transition boundaries
- intercepted route modal over a stable background scene
- persistent R3F + Drei stage reacting to navigation action/direction
- cinematic 3s carousel lab (`/carousel/a`, `/carousel/b`) with shared 3D fly-through
  and switchable concurrency mode (`interrupt` vs `block`) from the shell controls

## How to use (inside this monorepo)

The example uses the local canary Next.js binary (`packages/next/dist/bin/next`)
because creative transition APIs are not in the published stable package yet.

From the repo root:

```bash
corepack pnpm --filter=next build
corepack pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
corepack pnpm --dir examples/with-next-creative-studio dev
```

Then open `http://localhost:3000`.

## Routes

- `/` control room + modal triggers
- `/work`
- `/about`
- `/carousel/a`
- `/carousel/b`
- `/photos/[id]` full-page detail route
- `@modal/(.)photos/[id]` intercepted modal version
