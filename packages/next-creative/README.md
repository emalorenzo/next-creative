# next-creative

Creative-first Next.js distribution focused on advanced route transitions.

## Install

```bash
npm i next-creative
```

Then run your app normally:

```bash
npm run dev
```

Or explicitly:

```bash
npx next-creative dev
```

## Imports

- `next-creative`
  - Re-exports Next core API
- `next-creative/navigation`
  - Re-exports `next/navigation` and creative transition primitives

```ts
import { useRouter, TransitionBoundary } from 'next-creative/navigation'
```

## Demo

Studio example app:

- https://github.com/emalorenzo/next-creative/tree/main/examples/with-next-creative-studio
