# with-next-creative-studio

Creative App Router transitions with a persistent WebGL stage (R3F + Drei).

## What this example shows

- interruption-safe exits (`interrupt`) without stale completion callbacks
- directional back/forward choreography (`transition.direction`)
- persistent layout with independent content and modal boundaries
- intercepted route modal over a stable background scene
- persistent R3F + Drei stage reacting to navigation action/direction
- cinematic 3s carousel lab (`/carousel/a`, `/carousel/b`) with switchable mode (`interrupt` vs `block`)

## Run from this repo

From the repository root:

```bash
corepack pnpm --filter=next build
corepack pnpm --dir examples/with-next-creative-studio install --ignore-workspace --lockfile=false
corepack pnpm --dir examples/with-next-creative-studio dev
```

Open `http://localhost:3000`.

## Continue building from here

Add pages directly inside `app/`:

- `app/contact/page.jsx` -> `/contact`
- `app/case-studies/page.jsx` -> `/case-studies`
- `app/case-studies/[slug]/page.jsx` -> dynamic detail route

This is a normal Next.js App Router app, so you can keep extending routes/components as usual.

## Routes included

- `/` control room + modal triggers
- `/work`
- `/about`
- `/carousel/a`
- `/carousel/b`
- `/photos/[id]` full-page detail route
- `@modal/(.)photos/[id]` intercepted modal version
