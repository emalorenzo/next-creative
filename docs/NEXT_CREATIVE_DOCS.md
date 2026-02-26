# Next Creative Docs Index

## Purpose

Central index for product and engineering docs related to `next-creative`.

## Documents

- `docs/PLAN.md`
  - product strategy, architecture direction, milestones
- `docs/TASKS.md`
  - actionable roadmap and open questions
- `docs/NEXT_CREATIVE_API.md`
  - API contract draft for `next-creative/navigation`
- `docs/NEXT_CREATIVE_EXAMPLES.md`
  - initial usage examples for `useRouteTransition` and `completeExit()`

## Current Status

- Product direction locked: single framework (`next-creative`)
- Namespace direction locked: `next-creative/navigation`
- First transition runtime slice implemented in router core
- Exiting snapshot stability fixed at runtime boundary
- `next-creative/navigation` package shim added and validated in isolated e2e
- `TransitionBoundary` initial API implemented and validated in isolated e2e
- `defineTransitions` initial resolver implemented and validated in isolated e2e
- Initial concurrency/cancellation API implemented (`interrupt|queue|block`, `cancelExit`, queue assertions in e2e)
- Same-path direction policy implemented (`push`/`replace` query/hash updates resolve to `direction: none`)
- Parallel/intercepted route coordination implemented via segment-scoped default transition keys
- Initial docs examples added for `useRouteTransition` + `completeExit()`
- Advanced creative examples added (interruptions, back/forward directional exits, persistent layout choreography, GSAP/Framer/WebGL handoff)
