'use client'

import Link from 'next/link'
import {
  TransitionBoundary,
  defineTransitions,
  usePathname,
  useRouter,
} from 'next-creative/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'

const transitions = defineTransitions({
  rules: [
    {
      name: 'home-to-about',
      from: '/',
      to: '/about',
    },
    {
      name: 'about-to-home',
      from: '/about',
      to: '/',
      direction: 'backward',
    },
  ],
  default: 'default-transition',
})

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [explicitTransition, setExplicitTransition] = useState<string | null>(
    null
  )

  return (
    <TransitionBoundary
      transitions={transitions}
      explicitTransition={explicitTransition}
      concurrency={{
        policy: 'queue',
        maxQueue: 8,
      }}
      render={({
        entering,
        exiting,
        transition,
        resolvedTransition,
        concurrencyPolicy,
        queuedExits,
        completeExit,
        cancelExit,
      }) => (
        <html>
          <body>
            <nav>
              <Link
                href="/"
                data-testid="link-home"
                onClick={() => {
                  setExplicitTransition(null)
                }}
              >
                Home
              </Link>
              <Link
                href="/about"
                data-testid="link-about"
                onClick={() => {
                  setExplicitTransition('about-link-explicit')
                }}
              >
                About
              </Link>
              <Link
                href="/work"
                data-testid="link-work"
                onClick={() => {
                  setExplicitTransition(null)
                }}
              >
                Work
              </Link>
              <button
                data-testid="push-same-path-query"
                onClick={() => {
                  setExplicitTransition(null)
                  router.push(`${pathname}?creative=1`)
                }}
              >
                Push same path query
              </button>
              <Link
                href="/photos/1"
                data-testid="link-photo"
                onClick={() => {
                  setExplicitTransition(null)
                }}
              >
                Photo 1
              </Link>
            </nav>

            <div data-testid="transition-action">
              {transition?.action ?? 'none'}
            </div>
            <div data-testid="transition-direction">
              {transition?.direction ?? 'none'}
            </div>
            <div data-testid="resolved-transition-source">
              {resolvedTransition.source}
            </div>
            <div data-testid="resolved-transition-name">
              {resolvedTransition.name ?? 'none'}
            </div>
            <div data-testid="concurrency-policy">{concurrencyPolicy}</div>
            <div data-testid="queued-exits">{queuedExits}</div>

            {exiting ? (
              <div data-testid="exiting-node">
                <div data-testid="exiting-key">{exiting.key}</div>
                {exiting.node}
                <button
                  data-testid="complete-exit"
                  onClick={() => {
                    completeExit()
                    setExplicitTransition(null)
                  }}
                >
                  complete exit
                </button>
                <button
                  data-testid="cancel-exit"
                  onClick={() => {
                    cancelExit()
                    setExplicitTransition(null)
                  }}
                >
                  cancel exit
                </button>
              </div>
            ) : (
              <div data-testid="exiting-node">none</div>
            )}

            <div data-testid="entering-key">{entering.key}</div>
            <div data-testid="entering-node">{entering.node}</div>

            <TransitionBoundary
              render={({
                entering: modalEntering,
                exiting: modalExiting,
                completeExit: completeModalExit,
                cancelExit: cancelModalExit,
              }) => (
                <div data-testid="modal-boundary">
                  {modalExiting ? (
                    <div data-testid="modal-exiting-node">
                      {modalExiting.node}
                      <button
                        data-testid="modal-complete-exit"
                        onClick={completeModalExit}
                      >
                        complete modal exit
                      </button>
                      <button
                        data-testid="modal-cancel-exit"
                        onClick={cancelModalExit}
                      >
                        cancel modal exit
                      </button>
                    </div>
                  ) : (
                    <div data-testid="modal-exiting-node">none</div>
                  )}
                  <div data-testid="modal-entering-node">
                    {modalEntering.node}
                  </div>
                </div>
              )}
            >
              {modal}
            </TransitionBoundary>
          </body>
        </html>
      )}
    >
      {children}
    </TransitionBoundary>
  )
}
