# Next Creative Plan

## Goal

Ship `next-creative` as a single framework product for creative developers and studios: Next.js DX + explicit enter/exit transition control.

## Product Decision

- One product only: `next-creative`.
- No user-facing split between core and transitions packages.
- Creative APIs are exposed under `next-creative/navigation`.
- Compatibility-first: existing Next mental model and file conventions remain intact.

## Current Progress

Implemented first transition runtime slice in the router core:

- Navigation metadata context:
  - action: `push | replace | traverse`
  - direction: `forward | backward | none`
  - from/to URLs + commit timestamp
- History index tracking in `app-router` to infer back/forward direction from `popstate`.
- Public hooks currently wired in router runtime:
  - `useNavigationTransition()`
  - `useRouteTransition(children)` with explicit `completeExit()` to release exiting node
- Exiting snapshot stability fix in `useRouteTransition`:
  - snapshot now freezes router and navigation contexts at runtime boundary
  - prevents exiting subtree from re-reading updated route state
- Namespace rollout:
  - added `next-creative` package shim exposing `next-creative/navigation`
  - e2e fixture now imports creative hooks from `next-creative/navigation`
- Transition boundary runtime slice:
  - added `TransitionBoundary` in navigation runtime as wrapper over `useRouteTransition`
  - supports render-prop orchestration and optional `routeKey` to scope transition ownership
- Transition resolver runtime slice:
  - added `defineTransitions` and `resolveRouteTransition` in navigation runtime
  - resolver priority implemented as: explicit override -> first matching rule -> default transition
- Concurrency runtime slice:
  - `useRouteTransition` supports `interrupt | queue | block` policies
  - added `cancelExit()` and optional auto-release via `timeoutMs`
  - queue policy validated in e2e with multi-navigation overlap
- Direction policy slice:
  - same-path `push`/`replace` navigations (search/hash updates) now resolve to `direction: none`
  - validated in `route-transition-hooks` e2e via same-path query navigation assertion
- Parallel/interception coordination slice:
  - default transition ownership key now derives from layout segment scope (instead of only pathname)
  - preserves background/content boundaries on intercepted modal navigations while allowing the intercepted slot to transition
  - validated in `route-transition-hooks` e2e with `@modal` interception fixture coverage
- Docs/examples slice:
  - added initial examples for `useRouteTransition` + `completeExit()`
  - documented queue flow (`completeExit` progression and `cancelExit` reset)
  - added advanced showcase examples for interruption-safe exits, browser back/forward direction choreography, persistent layout transitions, GSAP, Framer Motion, and WebGL scene handoff
- Added e2e fixture scaffold:
  - `test/e2e/app-dir/route-transition-hooks/*`
- Built local precompiled artifacts required by e2e harness (`packages/next/dist`, related workspace deps).
- Executed e2e:
  - `route-transition-hooks` now passes after runtime-boundary context freeze.
  - isolated install confirms `next-creative/navigation` resolves and passes.

## Target Developer Experience

- Keep Next conventions:
  - App Router
  - RSC and streaming
  - layouts/templates/parallel routes
  - `Link`/`router` flows
- Add creative transition power:
  - explicit ownership of entering/exiting nodes
  - route-to-route transition resolution (`from -> to`)
  - direction-aware back/forward transitions
  - lifecycle hooks for GSAP/WebGL/audio orchestration

## Architecture Direction

1. Navigation Signal Layer:
   - stable transition signal `{from,to,action,direction}` emitted at commit time
2. Node Ownership Layer:
   - keep exiting snapshot mounted until explicit `completeExit()`
   - must preserve content at DOM/runtime boundary, not only ReactNode reference
3. Transition Resolver:
   - priority model: explicit link transition -> route rule -> default transition
4. Orchestrator:
   - concurrency policy (`block | queue | interrupt`)
   - cancel/timeout semantics
5. Boundary Model:
   - segment-scoped boundaries for nested layouts and complex navigation graphs

## Package Surface (User-facing)

- `next-creative/navigation`:
  - Next-compatible: `useRouter`, `usePathname`, `useSearchParams`, etc.
  - Creative: `useNavigationTransition`, `useRouteTransition`, `TransitionBoundary`, `defineTransitions`

## Current Blockers

- No current runtime blockers in Phase 2.

## Guardrails

- Do not break existing `useRouter` / `usePathname` behavior.
- Do not force animation library choice.
- Keep API additive and optional.
- Do not fork deeply into broad Next internals when a thin patch is enough.

## Milestones

1. Publish first creative docs set (GSAP, Framer, WebGL handoff, back transitions).
2. Release experimental build, gather studio feedback, iterate.

## Related Docs

- `docs/NEXT_CREATIVE_DOCS.md`
- `docs/NEXT_CREATIVE_API.md`
- `docs/TASKS.md`
