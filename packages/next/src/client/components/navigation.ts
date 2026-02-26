import type { Params } from '../../server/request/params'

import React, {
  useContext,
  useMemo,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AppRouterContext,
  LayoutRouterContext,
  GlobalLayoutRouterContext,
  type AppRouterInstance,
} from '../../shared/lib/app-router-context.shared-runtime'
import {
  SearchParamsContext,
  PathnameContext,
  PathParamsContext,
  NavigationPromisesContext,
  NavigationTransitionContext,
  type NavigationTransitionAction,
  type NavigationTransitionDirection,
  type NavigationTransition,
  ReadonlyURLSearchParams,
} from '../../shared/lib/hooks-client-context.shared-runtime'
import {
  computeSelectedLayoutSegment,
  getSelectedLayoutSegmentPath,
  PAGE_SEGMENT_KEY,
} from '../../shared/lib/segment'

const useDynamicRouteParams =
  typeof window === 'undefined'
    ? (
        require('../../server/app-render/dynamic-rendering') as typeof import('../../server/app-render/dynamic-rendering')
      ).useDynamicRouteParams
    : undefined

const useDynamicSearchParams =
  typeof window === 'undefined'
    ? (
        require('../../server/app-render/dynamic-rendering') as typeof import('../../server/app-render/dynamic-rendering')
      ).useDynamicSearchParams
    : undefined

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
 * that lets you *read* the current URL's search parameters.
 *
 * Learn more about [`URLSearchParams` on MDN](https://developer.mozilla.org/docs/Web/API/URLSearchParams)
 *
 * @example
 * ```ts
 * "use client"
 * import { useSearchParams } from 'next/navigation'
 *
 * export default function Page() {
 *   const searchParams = useSearchParams()
 *   searchParams.get('foo') // returns 'bar' when ?foo=bar
 *   // ...
 * }
 * ```
 *
 * Read more: [Next.js Docs: `useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
 */
// Client components API
export function useSearchParams(): ReadonlyURLSearchParams {
  useDynamicSearchParams?.('useSearchParams()')

  const searchParams = useContext(SearchParamsContext)

  // In the case where this is `null`, the compat types added in
  // `next-env.d.ts` will add a new overload that changes the return type to
  // include `null`.
  const readonlySearchParams = useMemo((): ReadonlyURLSearchParams => {
    if (!searchParams) {
      // When the router is not ready in pages, we won't have the search params
      // available.
      return null!
    }

    return new ReadonlyURLSearchParams(searchParams)
  }, [searchParams])

  // Instrument with Suspense DevTools (dev-only)
  if (process.env.NODE_ENV !== 'production' && 'use' in React) {
    const navigationPromises = use(NavigationPromisesContext)
    if (navigationPromises) {
      return use(navigationPromises.searchParams)
    }
  }

  return readonlySearchParams
}

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
 * that lets you read the current URL's pathname.
 *
 * @example
 * ```ts
 * "use client"
 * import { usePathname } from 'next/navigation'
 *
 * export default function Page() {
 *  const pathname = usePathname() // returns "/dashboard" on /dashboard?foo=bar
 *  // ...
 * }
 * ```
 *
 * Read more: [Next.js Docs: `usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
 */
// Client components API
export function usePathname(): string {
  useDynamicRouteParams?.('usePathname()')

  // In the case where this is `null`, the compat types added in `next-env.d.ts`
  // will add a new overload that changes the return type to include `null`.
  const pathname = useContext(PathnameContext) as string

  // Instrument with Suspense DevTools (dev-only)
  if (process.env.NODE_ENV !== 'production' && 'use' in React) {
    const navigationPromises = use(NavigationPromisesContext)
    if (navigationPromises) {
      return use(navigationPromises.pathname)
    }
  }

  return pathname
}

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
 * that returns metadata about the latest committed navigation.
 *
 * The returned value is `null` until the first client-side navigation completes.
 */
export function useNavigationTransition(): NavigationTransition | null {
  return useContext(NavigationTransitionContext)
}

export type RouteTransitionSnapshot = {
  key: string
  node: React.ReactNode
}

export type RouteTransitionState = {
  entering: RouteTransitionSnapshot
  exiting: RouteTransitionSnapshot | null
  transition: NavigationTransition | null
  resolvedTransition: ResolvedRouteTransition
  concurrencyPolicy: RouteTransitionConcurrencyPolicy
  queuedExits: number
  isTransitioning: boolean
  completeExit: () => void
  cancelExit: () => void
}

export type TransitionPattern =
  | string
  | RegExp
  | ((pathname: string, transition: NavigationTransition) => boolean)

export type ExplicitTransition = {
  name: string
  meta?: unknown
}

export type TransitionRule = {
  name: string
  from?: TransitionPattern | TransitionPattern[]
  to?: TransitionPattern | TransitionPattern[]
  action?: NavigationTransitionAction | NavigationTransitionAction[]
  direction?: NavigationTransitionDirection | NavigationTransitionDirection[]
  meta?: unknown
}

export type DefinedTransitions = {
  rules: TransitionRule[]
  defaultTransition: ExplicitTransition | null
}

export type ResolvedRouteTransitionSource =
  | 'explicit'
  | 'rule'
  | 'default'
  | 'none'

export type ResolvedRouteTransition = {
  source: ResolvedRouteTransitionSource
  name: string | null
  meta: unknown
  ruleIndex: number | null
  transition: NavigationTransition | null
}

export type RouteTransitionConcurrencyPolicy = 'interrupt' | 'queue' | 'block'

export type RouteTransitionConcurrency = {
  policy?: RouteTransitionConcurrencyPolicy
  timeoutMs?: number
  maxQueue?: number
}

export type RouteTransitionOptions = {
  key?: string
  transitions?: DefinedTransitions
  explicitTransition?: string | ExplicitTransition | null
  concurrency?: RouteTransitionConcurrency
}

export type TransitionBoundaryProps = {
  children: React.ReactNode
  routeKey?: string
  transitions?: DefinedTransitions
  explicitTransition?: string | ExplicitTransition | null
  concurrency?: RouteTransitionConcurrency
  render?: (state: RouteTransitionState) => React.ReactNode
}

type RouteTransitionFrozenContext = {
  appRouter: React.ContextType<typeof AppRouterContext>
  layoutRouter: React.ContextType<typeof LayoutRouterContext>
  globalLayoutRouter: React.ContextType<typeof GlobalLayoutRouterContext>
  pathname: React.ContextType<typeof PathnameContext>
  searchParams: React.ContextType<typeof SearchParamsContext>
  pathParams: React.ContextType<typeof PathParamsContext>
  navigationPromises: React.ContextType<typeof NavigationPromisesContext>
  transition: React.ContextType<typeof NavigationTransitionContext>
}

function toArray<T>(value: T | T[] | undefined): T[] | undefined {
  if (value === undefined) {
    return undefined
  }
  return Array.isArray(value) ? value : [value]
}

function toPathname(url: string): string {
  try {
    const parsedUrl = new URL(url, 'http://n')
    return parsedUrl.pathname
  } catch {
    return url
  }
}

function toScopedRouteTransitionSegmentKey(segment: unknown): string {
  if (Array.isArray(segment)) {
    return segment.map((value) => String(value)).join('|')
  }

  if (typeof segment === 'string' && segment.startsWith(PAGE_SEGMENT_KEY)) {
    return PAGE_SEGMENT_KEY
  }

  return String(segment)
}

function getScopedRouteTransitionKey(
  pathname: string,
  layoutRouter: React.ContextType<typeof LayoutRouterContext>
): string {
  if (!layoutRouter) {
    return pathname
  }

  const parentSegmentPath = layoutRouter.parentSegmentPath ?? []
  const parentScope = parentSegmentPath.map((segment, index) =>
    index % 2 === 1
      ? toScopedRouteTransitionSegmentKey(segment)
      : String(segment)
  )
  const childrenScope = getSelectedLayoutSegmentPath(
    layoutRouter.parentTree,
    'children'
  ).map(toScopedRouteTransitionSegmentKey)

  return ['scope', ...parentScope, 'children', ...childrenScope].join('/')
}

function escapeRegex(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchesTransitionPattern(
  value: string,
  pattern: TransitionPattern,
  transition: NavigationTransition
): boolean {
  if (typeof pattern === 'string') {
    const wildcardRegex = new RegExp(
      `^${pattern.split('*').map(escapeRegex).join('.*')}$`
    )
    return wildcardRegex.test(value)
  }

  if (pattern instanceof RegExp) {
    return pattern.test(value)
  }

  return pattern(value, transition)
}

function matchesTransitionPatterns(
  value: string,
  patterns: TransitionPattern | TransitionPattern[] | undefined,
  transition: NavigationTransition
): boolean {
  const candidatePatterns = toArray(patterns)
  if (!candidatePatterns) {
    return true
  }

  for (const pattern of candidatePatterns) {
    if (matchesTransitionPattern(value, pattern, transition)) {
      return true
    }
  }

  return false
}

function matchesTransitionValues<T extends string>(
  value: T,
  candidates: T | T[] | undefined
): boolean {
  const candidateValues = toArray(candidates)
  if (!candidateValues) {
    return true
  }

  return candidateValues.includes(value)
}

function normalizeExplicitTransition(
  transition: string | ExplicitTransition | null | undefined
): ExplicitTransition | null {
  if (!transition) {
    return null
  }

  if (typeof transition === 'string') {
    return { name: transition }
  }

  return transition
}

function resolveRouteTransitionRule(
  transitions: DefinedTransitions,
  transition: NavigationTransition
): { rule: TransitionRule; ruleIndex: number } | null {
  const fromPathname = toPathname(transition.from)
  const toPathnameValue = toPathname(transition.to)

  for (let ruleIndex = 0; ruleIndex < transitions.rules.length; ruleIndex++) {
    const rule = transitions.rules[ruleIndex]

    if (
      !matchesTransitionPatterns(fromPathname, rule.from, transition) ||
      !matchesTransitionPatterns(toPathnameValue, rule.to, transition) ||
      !matchesTransitionValues(transition.action, rule.action) ||
      !matchesTransitionValues(transition.direction, rule.direction)
    ) {
      continue
    }

    return { rule, ruleIndex }
  }

  return null
}

export function defineTransitions(config: {
  rules?: TransitionRule[]
  default?: string | ExplicitTransition | null
}): DefinedTransitions {
  return {
    rules: config.rules ?? [],
    defaultTransition: normalizeExplicitTransition(config.default),
  }
}

export function resolveRouteTransition(options: {
  transition: NavigationTransition | null
  transitions?: DefinedTransitions
  explicitTransition?: string | ExplicitTransition | null
}): ResolvedRouteTransition {
  const { transition, transitions, explicitTransition } = options
  const normalizedExplicitTransition =
    normalizeExplicitTransition(explicitTransition)

  if (normalizedExplicitTransition) {
    return {
      source: 'explicit',
      name: normalizedExplicitTransition.name,
      meta: normalizedExplicitTransition.meta,
      ruleIndex: null,
      transition,
    }
  }

  if (transition && transitions) {
    const matchedRule = resolveRouteTransitionRule(transitions, transition)
    if (matchedRule) {
      return {
        source: 'rule',
        name: matchedRule.rule.name,
        meta: matchedRule.rule.meta,
        ruleIndex: matchedRule.ruleIndex,
        transition,
      }
    }

    if (transitions.defaultTransition) {
      return {
        source: 'default',
        name: transitions.defaultTransition.name,
        meta: transitions.defaultTransition.meta,
        ruleIndex: null,
        transition,
      }
    }
  }

  return {
    source: 'none',
    name: null,
    meta: undefined,
    ruleIndex: null,
    transition,
  }
}

function createRouteTransitionSnapshot(
  pathname: string,
  node: React.ReactNode,
  frozenContext: RouteTransitionFrozenContext
): RouteTransitionSnapshot {
  return {
    key: pathname,
    node: React.createElement(
      NavigationPromisesContext.Provider,
      { value: frozenContext.navigationPromises },
      React.createElement(
        NavigationTransitionContext.Provider,
        { value: frozenContext.transition },
        React.createElement(
          PathParamsContext.Provider,
          { value: frozenContext.pathParams },
          React.createElement(
            PathnameContext.Provider,
            { value: frozenContext.pathname },
            React.createElement(
              SearchParamsContext.Provider,
              { value: frozenContext.searchParams },
              React.createElement(
                GlobalLayoutRouterContext.Provider,
                { value: frozenContext.globalLayoutRouter },
                React.createElement(
                  AppRouterContext.Provider,
                  { value: frozenContext.appRouter },
                  React.createElement(
                    LayoutRouterContext.Provider,
                    { value: frozenContext.layoutRouter },
                    node
                  )
                )
              )
            )
          )
        )
      )
    ),
  }
}

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
 * that preserves the previous route node while a new route is entering.
 *
 * This gives you full control over exit/enter choreography, similar to
 * react-transition-group's explicit node ownership.
 */
export function useRouteTransition(
  children: React.ReactNode,
  options?: RouteTransitionOptions
): RouteTransitionState {
  const pathname = usePathname()
  const concurrencyPolicy = options?.concurrency?.policy ?? 'interrupt'
  const concurrencyTimeoutMs = options?.concurrency?.timeoutMs
  const concurrencyMaxQueue = options?.concurrency?.maxQueue
  const transition = useNavigationTransition()
  const appRouter = useContext(AppRouterContext)
  const layoutRouter = useContext(LayoutRouterContext)
  const routeKey =
    options?.key ?? getScopedRouteTransitionKey(pathname, layoutRouter)
  const globalLayoutRouter = useContext(GlobalLayoutRouterContext)
  const searchParams = useContext(SearchParamsContext)
  const pathParams = useContext(PathParamsContext)
  const navigationPromises = useContext(NavigationPromisesContext)
  const resolvedTransition = useMemo(
    () =>
      resolveRouteTransition({
        transition,
        transitions: options?.transitions,
        explicitTransition: options?.explicitTransition,
      }),
    [transition, options?.transitions, options?.explicitTransition]
  )

  const frozenContext = useMemo<RouteTransitionFrozenContext>(
    () => ({
      appRouter,
      layoutRouter,
      globalLayoutRouter,
      pathname,
      searchParams,
      pathParams,
      navigationPromises,
      transition,
    }),
    [
      appRouter,
      layoutRouter,
      globalLayoutRouter,
      pathname,
      searchParams,
      pathParams,
      navigationPromises,
      transition,
    ]
  )

  const previousSnapshotRef = useRef<RouteTransitionSnapshot>(
    createRouteTransitionSnapshot(routeKey, children, frozenContext)
  )
  const [exiting, setExiting] = useState<RouteTransitionSnapshot | null>(null)
  const [queuedExits, setQueuedExits] = useState(0)
  const exitingRef = useRef<RouteTransitionSnapshot | null>(null)
  const queuedSnapshotsRef = useRef<RouteTransitionSnapshot[]>([])
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    exitingRef.current = exiting
  }, [exiting])

  const clearExitTimeout = useCallback(() => {
    if (exitTimeoutRef.current !== null) {
      clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    const previousSnapshot = previousSnapshotRef.current
    if (previousSnapshot.key !== routeKey) {
      if (concurrencyPolicy === 'interrupt') {
        queuedSnapshotsRef.current = []
        setQueuedExits(0)
        setExiting(previousSnapshot)
      } else if (concurrencyPolicy === 'block') {
        if (exitingRef.current === null) {
          setExiting(previousSnapshot)
        }
      } else {
        if (exitingRef.current === null) {
          setExiting(previousSnapshot)
        } else {
          const maxQueue =
            typeof concurrencyMaxQueue === 'number'
              ? Math.max(0, Math.floor(concurrencyMaxQueue))
              : Number.POSITIVE_INFINITY

          if (maxQueue > 0 && queuedSnapshotsRef.current.length < maxQueue) {
            queuedSnapshotsRef.current.push(previousSnapshot)
            setQueuedExits(queuedSnapshotsRef.current.length)
          }
        }
      }
    }

    previousSnapshotRef.current = createRouteTransitionSnapshot(
      routeKey,
      children,
      frozenContext
    )
  }, [
    routeKey,
    children,
    frozenContext,
    concurrencyPolicy,
    concurrencyMaxQueue,
  ])

  const completeExit = useCallback(() => {
    clearExitTimeout()
    if (
      concurrencyPolicy === 'queue' &&
      queuedSnapshotsRef.current.length > 0
    ) {
      const nextExiting = queuedSnapshotsRef.current.shift()!
      setQueuedExits(queuedSnapshotsRef.current.length)
      setExiting(nextExiting)
      return
    }

    queuedSnapshotsRef.current = []
    setQueuedExits(0)
    setExiting(null)
  }, [clearExitTimeout, concurrencyPolicy])

  const cancelExit = useCallback(() => {
    clearExitTimeout()
    queuedSnapshotsRef.current = []
    setQueuedExits(0)
    setExiting(null)
  }, [clearExitTimeout])

  useEffect(() => {
    clearExitTimeout()
    if (
      exiting === null ||
      typeof concurrencyTimeoutMs !== 'number' ||
      concurrencyTimeoutMs <= 0
    ) {
      return
    }

    exitTimeoutRef.current = setTimeout(() => {
      completeExit()
    }, concurrencyTimeoutMs)

    return clearExitTimeout
  }, [exiting, concurrencyTimeoutMs, clearExitTimeout, completeExit])

  useEffect(() => {
    return () => {
      clearExitTimeout()
      queuedSnapshotsRef.current = []
    }
  }, [clearExitTimeout])

  return {
    entering: {
      key: routeKey,
      node: children,
    },
    exiting,
    transition,
    resolvedTransition,
    concurrencyPolicy,
    queuedExits,
    isTransitioning: exiting !== null,
    completeExit,
    cancelExit,
  }
}

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) helper
 * for route transition orchestration at a layout/segment boundary.
 *
 * By default, the transition key is the current pathname. Pass `routeKey` to scope
 * transitions to a nested segment key.
 */
export function TransitionBoundary({
  children,
  routeKey,
  transitions,
  explicitTransition,
  concurrency,
  render,
}: TransitionBoundaryProps): React.ReactNode {
  const state = useRouteTransition(
    children,
    routeKey || transitions || explicitTransition || concurrency
      ? {
          key: routeKey,
          transitions,
          explicitTransition,
          concurrency,
        }
      : undefined
  )

  if (render) {
    return render(state)
  }

  return state.entering.node
}

// Client components API
export {
  ServerInsertedHTMLContext,
  useServerInsertedHTML,
} from '../../shared/lib/server-inserted-html.shared-runtime'

/**
 *
 * This hook allows you to programmatically change routes inside [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components).
 *
 * @example
 * ```ts
 * "use client"
 * import { useRouter } from 'next/navigation'
 *
 * export default function Page() {
 *  const router = useRouter()
 *  // ...
 *  router.push('/dashboard') // Navigate to /dashboard
 * }
 * ```
 *
 * Read more: [Next.js Docs: `useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router)
 */
// Client components API
export function useRouter(): AppRouterInstance {
  const router = useContext(AppRouterContext)
  if (router === null) {
    throw new Error('invariant expected app router to be mounted')
  }

  return router
}

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
 * that lets you read a route's dynamic params filled in by the current URL.
 *
 * @example
 * ```ts
 * "use client"
 * import { useParams } from 'next/navigation'
 *
 * export default function Page() {
 *   // on /dashboard/[team] where pathname is /dashboard/nextjs
 *   const { team } = useParams() // team === "nextjs"
 * }
 * ```
 *
 * Read more: [Next.js Docs: `useParams`](https://nextjs.org/docs/app/api-reference/functions/use-params)
 */
// Client components API
export function useParams<T extends Params = Params>(): T {
  useDynamicRouteParams?.('useParams()')

  const params = useContext(PathParamsContext) as T

  // Instrument with Suspense DevTools (dev-only)
  if (process.env.NODE_ENV !== 'production' && 'use' in React) {
    const navigationPromises = use(NavigationPromisesContext)
    if (navigationPromises) {
      return use(navigationPromises.params) as T
    }
  }

  return params
}

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
 * that lets you read the active route segments **below** the Layout it is called from.
 *
 * @example
 * ```ts
 * 'use client'
 *
 * import { useSelectedLayoutSegments } from 'next/navigation'
 *
 * export default function ExampleClientComponent() {
 *   const segments = useSelectedLayoutSegments()
 *
 *   return (
 *     <ul>
 *       {segments.map((segment, index) => (
 *         <li key={index}>{segment}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 *
 * Read more: [Next.js Docs: `useSelectedLayoutSegments`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments)
 */
// Client components API
export function useSelectedLayoutSegments(
  parallelRouteKey: string = 'children'
): string[] {
  useDynamicRouteParams?.('useSelectedLayoutSegments()')

  const context = useContext(LayoutRouterContext)
  // @ts-expect-error This only happens in `pages`. Type is overwritten in navigation.d.ts
  if (!context) return null

  // Instrument with Suspense DevTools (dev-only)
  if (process.env.NODE_ENV !== 'production' && 'use' in React) {
    const navigationPromises = use(NavigationPromisesContext)
    if (navigationPromises) {
      const promise =
        navigationPromises.selectedLayoutSegmentsPromises?.get(parallelRouteKey)
      if (promise) {
        // We should always have a promise here, but if we don't, it's not worth erroring over.
        // We just won't be able to instrument it, but can still provide the value.
        return use(promise)
      }
    }
  }

  return getSelectedLayoutSegmentPath(context.parentTree, parallelRouteKey)
}

/**
 * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
 * that lets you read the active route segment **one level below** the Layout it is called from.
 *
 * @example
 * ```ts
 * 'use client'
 * import { useSelectedLayoutSegment } from 'next/navigation'
 *
 * export default function ExampleClientComponent() {
 *   const segment = useSelectedLayoutSegment()
 *
 *   return <p>Active segment: {segment}</p>
 * }
 * ```
 *
 * Read more: [Next.js Docs: `useSelectedLayoutSegment`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment)
 */
// Client components API
export function useSelectedLayoutSegment(
  parallelRouteKey: string = 'children'
): string | null {
  useDynamicRouteParams?.('useSelectedLayoutSegment()')
  const navigationPromises = useContext(NavigationPromisesContext)
  const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey)

  // Instrument with Suspense DevTools (dev-only)
  if (
    process.env.NODE_ENV !== 'production' &&
    navigationPromises &&
    'use' in React
  ) {
    const promise =
      navigationPromises.selectedLayoutSegmentPromises?.get(parallelRouteKey)
    if (promise) {
      // We should always have a promise here, but if we don't, it's not worth erroring over.
      // We just won't be able to instrument it, but can still provide the value.
      return use(promise)
    }
  }

  return computeSelectedLayoutSegment(selectedLayoutSegments, parallelRouteKey)
}

export { unstable_isUnrecognizedActionError } from './unrecognized-action-error'

// Shared components APIs
export {
  // We need the same class that was used to instantiate the context value
  // Otherwise instanceof checks will fail in usercode
  ReadonlyURLSearchParams,
}
export {
  notFound,
  forbidden,
  unauthorized,
  redirect,
  permanentRedirect,
  RedirectType,
  unstable_rethrow,
} from './navigation.react-server'
