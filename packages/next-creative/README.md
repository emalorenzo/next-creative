# next-creative

`next-creative` is the distribution layer for this fork.

It ships a `next` CLI binary and proxies core imports to the bundled `next`
dependency, so consumers can start with:

```bash
npm i next-creative
```

## Public API

- `next-creative` (root export)
  - Re-exports the `next` package
- `next-creative/navigation`
  - Re-exports `next/navigation`, including creative transition hooks.
