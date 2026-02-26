# Tasks

## Product

- [x] Commit to mono-product direction: `next-creative`.
- [x] Commit to creative API namespace: `next-creative/navigation`.
- [x] Create docs index for product artifacts (`docs/NEXT_CREATIVE_DOCS.md`).
- [x] Draft API contract for creative navigation (`docs/NEXT_CREATIVE_API.md`).

## In Progress

- [x] Clone and inspect `next.js` internals related to App Router commit flow.
- [x] Review working transition pattern from `~/dev/www` (`react-transition-group`).
- [x] Implement navigation transition metadata in router core.
- [x] Expose creative transition hooks in `next/navigation`.
- [x] Add initial e2e fixture for route transition hooks.

## Immediate

- [x] Build/precompile Next.js locally so e2e Jest runner can execute.
- [x] Run `test/e2e/app-dir/route-transition-hooks/route-transition-hooks.test.ts`.
- [x] Replace ReactNode snapshot logic with stable exiting-content strategy (freeze router/context at runtime boundary for exiting subtree).
- [x] Re-run `route-transition-hooks` e2e until green.
- [x] Rename/document public surface as `next-creative/navigation` (package shim + e2e fixture import).
- [x] Add initial docs examples for `useRouteTransition` + `completeExit()`.

## Phase 2

- [ ] Design segment-scoped transition API for nested layouts.
- [x] Implement `TransitionBoundary` for layout/segment-level choreography (initial render-prop API with optional `routeKey` scoping).
- [x] Implement transition resolver (`defineTransitions`: explicit override -> route rule -> default) and validate in e2e.
- [x] Implement concurrency/cancellation primitives (`interrupt | queue | block`, `cancelExit`, `timeoutMs`) and validate queue behavior in e2e.
- [x] Preserve/coordinate transitions across parallel routes and intercepted routes.
- [x] Add direction policies for same-path navigations (hash/search-only updates).

## Phase 3

- [ ] Publish developer docs for creative transitions.
- [x] Add examples: GSAP, Framer Motion, WebGL scene handoff.
- [ ] Add migration guide from `react-transition-group` patterns.
- [ ] Add migration guide from Taxi.js patterns.

## Open Questions

- [ ] Should creative APIs ship under `experimental_*` for first release?
- [ ] Do we need explicit transition IDs for concurrent navigations?
- [ ] Should `replace` default to `direction: none` or be configurable?
- [ ] Should lifecycle callbacks be declarative (`defineTransitions`) or hook-based first?
