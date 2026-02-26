# Next Creative Examples

This file focuses on high-impact creative cases that usually required hacks in
classic App Router flows.

## Creative Coder Flex Cases

These are the scenarios to show off:

- interrupted transitions without stale animation callbacks
- browser back/forward (UI arrows, trackpad gesture, keyboard shortcuts)
- exit animation when returning (`direction: backward`)
- persistent layout/chrome with independent enter/exit choreography
- parallel + intercepted slot transitions without collapsing the background

## Example 1: Interruption-Safe Exit Ownership (`interrupt`)

Use `concurrency.policy = "interrupt"` and guard completion callbacks with a run
token so stale timelines do not release the wrong exit node.

```tsx
'use client'

import Link from 'next/link'
import { useRouteTransition } from 'next-creative/navigation'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

export function InterruptSafeShell({ children }: { children: ReactNode }) {
  const exitingRef = useRef<HTMLDivElement | null>(null)
  const runIdRef = useRef(0)

  const { entering, exiting, transition, completeExit, cancelExit } =
    useRouteTransition(children, {
      concurrency: {
        policy: 'interrupt',
        timeoutMs: 900,
      },
    })

  useEffect(() => {
    if (!exiting) return

    const runId = ++runIdRef.current
    const node = exitingRef.current
    if (!node) {
      completeExit()
      return
    }

    const animation = node.animate(
      [
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
        { opacity: 0, transform: 'translate3d(-2.5rem,0,0) scale(0.985)' },
      ],
      { duration: 450, easing: 'cubic-bezier(.22,.61,.36,1)' }
    )

    animation.onfinish = () => {
      if (runId === runIdRef.current) {
        completeExit()
      }
    }

    return () => animation.cancel()
  }, [exiting, completeExit])

  return (
    <>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/work">Work</Link>
        <Link href="/about">About</Link>
        <button onClick={cancelExit}>cancel active exit</button>
      </nav>

      {exiting ? <div ref={exitingRef}>{exiting.node}</div> : null}
      <div>{entering.node}</div>

      <small>
        action: {transition?.action ?? 'none'} / direction:{' '}
        {transition?.direction ?? 'none'}
      </small>
    </>
  )
}
```

## Example 2: Back/Forward Directional Exit (including keyboard-driven nav)

`transition.direction` lets you animate different exit vectors for forward vs
backward traversal.

```tsx
'use client'

import { TransitionBoundary, useRouter } from 'next-creative/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

function BrowserHotkeys() {
  const router = useRouter()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'ArrowLeft') router.back()
      if (event.altKey && event.key === 'ArrowRight') router.forward()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router])

  return null
}

export function DirectionalShell({ children }: { children: ReactNode }) {
  return (
    <>
      <BrowserHotkeys />

      <TransitionBoundary
        concurrency={{ policy: 'queue', maxQueue: 4 }}
        render={({ entering, exiting, transition, completeExit }) => {
          const isBack =
            transition?.action === 'traverse' &&
            transition.direction === 'backward'

          return (
            <>
              {exiting ? (
                <section
                  className={isBack ? 'exit-backward' : 'exit-forward'}
                  onAnimationEnd={completeExit}
                >
                  {exiting.node}
                </section>
              ) : null}

              <section className={isBack ? 'enter-backward' : 'enter-forward'}>
                {entering.node}
              </section>
            </>
          )
        }}
      >
        {children}
      </TransitionBoundary>
    </>
  )
}
```

Notes:

- Browser arrows and trackpad gestures already produce `action: traverse`.
- The keyboard handler above only mirrors browser history navigation in-app.

## Example 3: Persistent Layout + Animated Exit/Enter Content

Keep the creative shell mounted while only content slots transition. This is the
key pattern for persistent HUD, audio, and camera layers.

```tsx
'use client'

import {
  TransitionBoundary,
  useNavigationTransition,
} from 'next-creative/navigation'
import type { ReactNode } from 'react'

function PersistentStage({ direction }: { direction: string }) {
  return <div className={`stage stage-${direction}`}>persistent stage</div>
}

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  const nav = useNavigationTransition()
  const direction = nav?.direction ?? 'none'

  return (
    <html>
      <body>
        <PersistentStage direction={direction} />

        <TransitionBoundary
          render={({ entering, exiting, transition, completeExit }) => {
            const back =
              transition?.action === 'traverse' &&
              transition.direction === 'backward'

            return (
              <main>
                {exiting ? (
                  <article
                    className={
                      back ? 'content-exit-back' : 'content-exit-forward'
                    }
                    onAnimationEnd={completeExit}
                  >
                    {exiting.node}
                  </article>
                ) : null}
                <article
                  className={
                    back ? 'content-enter-back' : 'content-enter-forward'
                  }
                >
                  {entering.node}
                </article>
              </main>
            )
          }}
        >
          {children}
        </TransitionBoundary>

        <TransitionBoundary
          render={({ entering, exiting, completeExit }) => (
            <aside>
              {exiting ? (
                <div className="modal-exit" onAnimationEnd={completeExit}>
                  {exiting.node}
                </div>
              ) : null}
              <div className="modal-enter">{entering.node}</div>
            </aside>
          )}
        >
          {modal}
        </TransitionBoundary>
      </body>
    </html>
  )
}
```

Why this matters:

- The stage/HUD remains mounted and can animate every navigation tick.
- Content and modal slots transition independently.
- Intercepted modal navigation can animate without remounting the background page.

## Example 4: GSAP Exit Timeline (direction-aware)

```tsx
'use client'

import gsap from 'gsap'
import { TransitionBoundary } from 'next-creative/navigation'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

export function GsapBoundary({ children }: { children: ReactNode }) {
  return (
    <TransitionBoundary
      concurrency={{ policy: 'interrupt' }}
      render={(state) => <GsapStage state={state} />}
    >
      {children}
    </TransitionBoundary>
  )
}

function GsapStage({
  state,
}: {
  state: {
    entering: { key: string; node: ReactNode }
    exiting: { key: string; node: ReactNode } | null
    transition: { direction: 'forward' | 'backward' | 'none' } | null
    completeExit: () => void
  }
}) {
  const exitingRef = useRef<HTMLDivElement | null>(null)
  const runIdRef = useRef(0)
  const { entering, exiting, transition, completeExit } = state

  useEffect(() => {
    if (!exiting || !exitingRef.current) return
    const runId = ++runIdRef.current
    const x = transition?.direction === 'backward' ? 60 : -60

    const timeline = gsap.timeline({
      onComplete: () => {
        if (runId === runIdRef.current) completeExit()
      },
    })

    timeline.to(exitingRef.current, { x, opacity: 0, duration: 0.45 })
    return () => timeline.kill()
  }, [exiting, transition, completeExit])

  return (
    <>
      {exiting ? <div ref={exitingRef}>{exiting.node}</div> : null}
      <div>{entering.node}</div>
    </>
  )
}
```

## Example 5: Framer Motion Exit + Enter Pair

```tsx
'use client'

import { motion } from 'framer-motion'
import { TransitionBoundary } from 'next-creative/navigation'
import type { ReactNode } from 'react'

export function FramerBoundary({ children }: { children: ReactNode }) {
  return (
    <TransitionBoundary
      render={({ entering, exiting, transition, completeExit }) => {
        const back = transition?.direction === 'backward'
        const exitX = back ? 80 : -80
        const enterX = back ? -40 : 40

        return (
          <>
            {exiting ? (
              <motion.div
                key={`exit-${exiting.key}`}
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 0, x: exitX }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onAnimationComplete={completeExit}
              >
                {exiting.node}
              </motion.div>
            ) : null}

            <motion.div
              key={`enter-${entering.key}`}
              initial={{ opacity: 0, x: enterX }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {entering.node}
            </motion.div>
          </>
        )
      }}
    >
      {children}
    </TransitionBoundary>
  )
}
```

## Example 6: WebGL Scene Handoff with Persistent Canvas

Use one persistent `<Canvas>` and route transitions to drive scene blending.

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import {
  TransitionBoundary,
  useNavigationTransition,
} from 'next-creative/navigation'
import type { ReactNode } from 'react'

function SceneDirector({
  action,
  direction,
}: {
  action: string
  direction: string
}) {
  return <group userData={{ action, direction }} />
}

export function WebGLHandoffLayout({ children }: { children: ReactNode }) {
  const nav = useNavigationTransition()

  return (
    <>
      <Canvas>
        <SceneDirector
          action={nav?.action ?? 'none'}
          direction={nav?.direction ?? 'none'}
        />
      </Canvas>

      <TransitionBoundary
        render={({ entering, exiting, completeExit }) => (
          <>
            {exiting ? (
              <section className="dom-exit" onAnimationEnd={completeExit}>
                {exiting.node}
              </section>
            ) : null}
            <section className="dom-enter">{entering.node}</section>
          </>
        )}
      >
        {children}
      </TransitionBoundary>
    </>
  )
}
```

---

Practical rule: keep transitions additive and optional.

- Standard pages can render `entering.node` only.
- Creative screens can opt into explicit ownership and choreography.
