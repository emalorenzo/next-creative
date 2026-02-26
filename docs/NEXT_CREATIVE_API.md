# Next Creative API (Draft)

## Scope

This document defines the first public API contract for creative navigation in `next-creative`.

Goal:

- preserve Next.js DX and conventions
- add explicit transition ownership for entering/exiting views

## Public Namespace

- `next-creative/navigation`

Current implementation:

- `next-creative/navigation` is available as a package shim that re-exports `next/navigation`.
- Creative hooks (`useNavigationTransition`, `useRouteTransition`) are available through this namespace.

## Compatibility

The namespace should export Next-compatible navigation hooks:

- `useRouter`
- `usePathname`
- `useSearchParams`
- `useParams`
- `useSelectedLayoutSegment`
- `useSelectedLayoutSegments`

These remain behavior-compatible with Next unless explicitly documented.

## Creative Extensions

### `useNavigationTransition()`

Returns metadata for the latest committed navigation.

```ts
type NavigationTransitionAction = 'push' | 'replace' | 'traverse'
type NavigationTransitionDirection = 'forward' | 'backward' | 'none'

type NavigationTransition = {
  from: string
  to: string
  action: NavigationTransitionAction
  direction: NavigationTransitionDirection
  committedAt: number
}
```

Returns `null` before first client-side navigation commit.

### `useRouteTransition(children)`

Keeps the previous route node mounted while the new route enters.

```ts
type RouteTransitionSnapshot = {
  key: string
  node: React.ReactNode
}

type RouteTransitionState = {
  entering: RouteTransitionSnapshot
  exiting: RouteTransitionSnapshot | null
  transition: NavigationTransition | null
  concurrencyPolicy: 'interrupt' | 'queue' | 'block'
  queuedExits: number
  resolvedTransition: {
    source: 'explicit' | 'rule' | 'default' | 'none'
    name: string | null
    meta: unknown
    ruleIndex: number | null
    transition: NavigationTransition | null
  }
  isTransitioning: boolean
  completeExit: () => void
  cancelExit: () => void
}
```

Behavior:

- when route key changes, previous node becomes `exiting`
- `exiting` remains mounted until `completeExit()`
- supports direction-aware transitions through `transition.direction`
- same-path `push`/`replace` navigations (query/hash-only) resolve with `direction: none`

Current implementation note:

- Exiting snapshots now freeze router/navigation context values at runtime boundary.
- This prevents preserved exiting nodes from consuming updated route state during enter/exit overlap.
- Segment-scoped ownership is supported by `TransitionBoundary` with optional `routeKey`.

Initial examples:

- `docs/NEXT_CREATIVE_EXAMPLES.md` includes:
  - interruption-safe exit ownership (`concurrency.policy = "interrupt"`) with stale-callback protection
  - queue policy wiring (`concurrency.policy = "queue"`) with `completeExit()` / `cancelExit()`
  - direction-aware back/forward choreography using `transition.action` + `transition.direction`
  - persistent layout + intercepted/parallel slot coordination patterns
  - GSAP, Framer Motion, and WebGL handoff integration examples

### `TransitionBoundary`

Segment/layout-scoped transition boundary for nested navigation choreography.

```ts
type TransitionBoundaryProps = {
  children: React.ReactNode
  routeKey?: string
  transitions?: DefinedTransitions
  explicitTransition?: string | { name: string; meta?: unknown } | null
  concurrency?: {
    policy?: 'interrupt' | 'queue' | 'block'
    timeoutMs?: number
    maxQueue?: number
  }
  render?: (state: RouteTransitionState) => React.ReactNode
}
```

Behavior:

- wraps `useRouteTransition` and provides `RouteTransitionState` to `render`
- defaults to rendering `entering.node` when `render` is not provided
- uses `routeKey` (or a layout segment-scoped key by default) to scope ownership of exiting/entering snapshots
- default scoping coordinates parallel/intercepted route slots so unaffected boundaries can stay stable while the changed slot transitions

### `defineTransitions(config)`

Creates a route transition resolver with deterministic priority.

```ts
type TransitionRule = {
  name: string
  from?:
    | string
    | RegExp
    | ((pathname: string, transition: NavigationTransition) => boolean)
  to?:
    | string
    | RegExp
    | ((pathname: string, transition: NavigationTransition) => boolean)
  action?: NavigationTransitionAction | NavigationTransitionAction[]
  direction?: NavigationTransitionDirection | NavigationTransitionDirection[]
  meta?: unknown
}

type DefinedTransitions = {
  rules: TransitionRule[]
  defaultTransition: { name: string; meta?: unknown } | null
}
```

Resolution priority:

1. explicit transition override
2. first matching `from -> to` route rule
3. configured default transition

`useRouteTransition`/`TransitionBoundary` expose `resolvedTransition`:

- `source`: `explicit | rule | default | none`
- `name`: selected transition name
- `ruleIndex`: matched rule index for diagnostics

### Concurrency Policy

Configurable policy for overlapping navigations:

- `block`
- `queue`
- `interrupt`

Current implementation:

- `queue` keeps additional exits buffered (`queuedExits`) and releases them one-by-one on `completeExit()`.
- `block` keeps the current exiting snapshot and drops new exit candidates until completion.
- `interrupt` replaces current exiting snapshot with the latest candidate.
- `cancelExit()` clears the active exit and queue immediately.
- `timeoutMs` can auto-complete exit ownership after a fixed duration.

## Non-goals

- No lock-in to a single animation engine.
- No replacement of App Router data/render pipeline.
- No forced usage of transitions for standard apps.
