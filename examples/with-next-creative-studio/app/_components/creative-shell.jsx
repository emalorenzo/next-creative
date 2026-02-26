"use client";

import Link from "next/link";
import {
  TransitionBoundary,
  defineTransitions,
  useNavigationTransition,
  usePathname,
  useRouter,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { StudioStage } from "./studio-stage";

const CAROUSEL_DURATION_MS = 3000;

const studioTransitions = defineTransitions({
  rules: [
    {
      name: "control-to-work",
      from: "/",
      to: "/work",
    },
    {
      name: "work-to-about",
      from: "/work",
      to: "/about",
    },
    {
      name: "history-back",
      action: "traverse",
      direction: "backward",
    },
    {
      name: "photos-route",
      to: /^\/photos\/\d+$/,
    },
    {
      name: "carousel-lab",
      to: /^\/carousel(?:\/[ab])?$/,
    },
  ],
  default: { name: "studio-default", meta: { timing: "cinematic" } },
});

function ContentTransition({
  entering,
  exiting,
  transition,
  resolvedTransition,
  concurrencyPolicy,
  queuedExits,
  completeExit,
  isCarouselLab,
  carouselMode,
  flightRef,
  onFlightStateChange,
}) {
  const exitingRef = useRef(null);
  const enteringRef = useRef(null);
  const contentStackRef = useRef(null);
  const runIdRef = useRef(0);
  const flightRafRef = useRef(null);
  const frozenBlockSnapshotsRef = useRef(null);

  const isBackward =
    transition?.action === "traverse" && transition?.direction === "backward";
  const shouldFreezeBlockSnapshots = isCarouselLab && carouselMode === "block";

  if (!shouldFreezeBlockSnapshots) {
    frozenBlockSnapshotsRef.current = null;
  } else if (exiting && frozenBlockSnapshotsRef.current === null) {
    frozenBlockSnapshotsRef.current = { entering, exiting };
  } else if (!exiting) {
    frozenBlockSnapshotsRef.current = null;
  }

  const activeSnapshots =
    shouldFreezeBlockSnapshots && frozenBlockSnapshotsRef.current
      ? frozenBlockSnapshotsRef.current
      : { entering, exiting };
  const activeEntering = activeSnapshots.entering;
  const activeExiting = activeSnapshots.exiting;

  const carouselRunEnteringDep =
    carouselMode === "block" ? "__block__" : activeEntering.key;

  useEffect(() => {
    if (isCarouselLab || !activeExiting) return;

    const runId = ++runIdRef.current;
    const node = exitingRef.current;

    if (!node) {
      completeExit();
      return;
    }

    const x = isBackward ? "72px" : "-72px";
    const tilt = isBackward ? "-1.6deg" : "1.6deg";

    const animation = node.animate(
      [
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)",
          filter: "blur(0px)",
        },
        {
          opacity: 0,
          transform: `translate3d(${x}, 0, 0) rotate(${tilt}) scale(0.982)`,
          filter: "blur(4px)",
        },
      ],
      {
        duration: 420,
        easing: "cubic-bezier(.22,.61,.36,1)",
        fill: "forwards",
      },
    );

    animation.onfinish = () => {
      if (runId === runIdRef.current) completeExit();
    };

    return () => animation.cancel();
  }, [activeExiting, completeExit, isBackward, isCarouselLab]);

  useEffect(() => {
    if (!isCarouselLab || !activeExiting) return;

    const runId = ++runIdRef.current;
    const durationMs = CAROUSEL_DURATION_MS;
    const contentStackNode = contentStackRef.current;
    const exitingNode = exitingRef.current;
    const enteringNode = enteringRef.current;

    flightRef.current.active = true;
    flightRef.current.progress = 0;
    flightRef.current.runId = runId;
    flightRef.current.durationMs = durationMs;
    flightRef.current.mode = carouselMode;
    flightRef.current.direction = transition?.direction ?? "none";
    onFlightStateChange?.(true);

    let overlayDisposed = false;
    let overlayRoot = null;
    let overlayExitingNode = null;
    let overlayEnteringNode = null;

    const teardownOverlay = () => {
      if (overlayDisposed) return;
      overlayDisposed = true;

      if (contentStackNode) {
        contentStackNode.classList.remove("content-stack-block-running");
      }

      overlayRoot?.remove();
    };

    if (
      carouselMode === "block" &&
      contentStackNode &&
      exitingNode &&
      enteringNode
    ) {
      contentStackNode.classList.add("content-stack-block-running");

      overlayRoot = document.createElement("div");
      overlayRoot.className = "carousel-dom-lock-overlay";

      overlayExitingNode = document.createElement("article");
      overlayExitingNode.className =
        "content-layer content-layer-carousel-exiting carousel-overlay-exit";
      overlayExitingNode.innerHTML = exitingNode.innerHTML;

      overlayEnteringNode = document.createElement("article");
      overlayEnteringNode.className =
        "content-layer content-layer-carousel-entering carousel-overlay-enter";
      overlayEnteringNode.innerHTML = enteringNode.innerHTML;

      overlayRoot.appendChild(overlayExitingNode);
      overlayRoot.appendChild(overlayEnteringNode);
      contentStackNode.appendChild(overlayRoot);
    }

    let finished = false;

    const finishRun = () => {
      if (finished || runId !== runIdRef.current) return;
      finished = true;
      flightRef.current.active = false;
      flightRef.current.progress = 1;
      onFlightStateChange?.(false);
      teardownOverlay();
      completeExit();
    };

    const targetExitingNode = overlayExitingNode ?? exitingNode;
    const targetEnteringNode = overlayEnteringNode ?? enteringNode;

    const exitingAnimation = targetExitingNode?.animate(
      [
        {
          opacity: 1,
          transform: "translate3d(0%, 0, 0) rotateY(0deg) scale(1)",
          filter: "blur(0px)",
        },
        {
          opacity: 0.25,
          transform: "translate3d(-120%, 0, -80px) rotateY(-24deg) scale(0.93)",
          filter: "blur(4px)",
        },
      ],
      {
        duration: durationMs,
        easing: "cubic-bezier(.22,.61,.36,1)",
        fill: "forwards",
      },
    );

    const enteringAnimation = targetEnteringNode?.animate(
      [
        {
          opacity: 0.25,
          transform: "translate3d(120%, 0, -80px) rotateY(16deg) scale(0.93)",
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          transform: "translate3d(0%, 0, 0) rotateY(0deg) scale(1)",
          filter: "blur(0px)",
        },
      ],
      {
        duration: durationMs,
        easing: "cubic-bezier(.22,.61,.36,1)",
        fill: "forwards",
      },
    );

    if (exitingAnimation) exitingAnimation.onfinish = finishRun;

    const startedAt = performance.now();
    const tickFlight = (now) => {
      if (runId !== runIdRef.current) return;
      const progress = Math.min((now - startedAt) / durationMs, 1);
      flightRef.current.progress = progress;

      if (progress < 1) {
        flightRafRef.current = requestAnimationFrame(tickFlight);
      } else if (!exitingAnimation) {
        finishRun();
      }
    };

    flightRafRef.current = requestAnimationFrame(tickFlight);
    const fallback = window.setTimeout(finishRun, durationMs + 120);

    return () => {
      window.clearTimeout(fallback);
      if (flightRafRef.current !== null) {
        cancelAnimationFrame(flightRafRef.current);
        flightRafRef.current = null;
      }
      exitingAnimation?.cancel();
      enteringAnimation?.cancel();

      if (runId === runIdRef.current) {
        flightRef.current.active = false;
        onFlightStateChange?.(false);
      }
      teardownOverlay();
    };
  }, [
    activeExiting,
    carouselMode,
    completeExit,
    carouselRunEnteringDep,
    isCarouselLab,
    flightRef,
    onFlightStateChange,
  ]);

  const contentStackClassName = isCarouselLab
    ? "content-stack content-stack-carousel"
    : "content-stack";

  return (
    <main
      className={`content-root ${isCarouselLab ? "content-root-carousel" : ""}`}
    >
      <header className="content-meta">
        <span className="meta-pill">
          concurrency: {isCarouselLab ? carouselMode : concurrencyPolicy}
        </span>
        <span className="meta-pill">queued exits: {queuedExits}</span>
        <span className="meta-pill">
          transition: {resolvedTransition.name ?? "none"}
        </span>
        {isCarouselLab ? (
          <span className="meta-pill">carousel duration: 3000ms</span>
        ) : null}
      </header>

      <div ref={contentStackRef} className={contentStackClassName}>
        {activeExiting ? (
          <article
            ref={exitingRef}
            className={`content-layer ${
              isCarouselLab
                ? "content-layer-carousel-exiting"
                : `content-layer-exiting ${
                    isBackward
                      ? "content-layer-exiting-back"
                      : "content-layer-exiting-forward"
                  }`
            }`}
          >
            {activeExiting.node}
          </article>
        ) : null}

        <article
          key={activeEntering.key}
          ref={enteringRef}
          className={`content-layer ${
            isCarouselLab
              ? "content-layer-carousel-entering"
              : `content-layer-entering ${
                  isBackward
                    ? "content-layer-entering-back"
                    : "content-layer-entering-forward"
                }`
          }`}
        >
          {activeEntering.node}
        </article>
      </div>
    </main>
  );
}

function ModalTransition({ entering, exiting, completeExit }) {
  if (!exiting && !entering.node) return null;

  return (
    <div className="modal-root">
      {exiting ? (
        <div
          className="modal-layer modal-layer-exiting"
          onAnimationEnd={(event) => {
            if (event.currentTarget === event.target) completeExit();
          }}
        >
          {exiting.node}
        </div>
      ) : null}

      {entering.node ? (
        <div key={entering.key} className="modal-layer modal-layer-entering">
          {entering.node}
        </div>
      ) : null}
    </div>
  );
}

export function CreativeShell({ children, modal }) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = useNavigationTransition();
  const [carouselMode, setCarouselMode] = useState("interrupt");
  const [isFlightActive, setIsFlightActive] = useState(false);
  const flightRef = useRef({
    active: false,
    progress: 0,
    runId: 0,
    durationMs: CAROUSEL_DURATION_MS,
    mode: "interrupt",
    direction: "none",
  });
  const lockStateRef = useRef({
    isCarouselLab: false,
    carouselMode: "interrupt",
    isFlightActive: false,
  });
  const suppressNextPopRef = useRef(false);
  const lastHistoryNavIdRef = useRef(null);

  const isCarouselLab = pathname.startsWith("/carousel");
  const contentPolicy = isCarouselLab ? carouselMode : "interrupt";
  const isNavigationLocked =
    isCarouselLab && carouselMode === "block" && isFlightActive;

  useEffect(() => {
    if (isCarouselLab) return;
    flightRef.current.active = false;
    flightRef.current.progress = 0;
    setIsFlightActive(false);
  }, [isCarouselLab]);

  useEffect(() => {
    lockStateRef.current = {
      isCarouselLab,
      carouselMode,
      isFlightActive,
    };
  }, [carouselMode, isCarouselLab, isFlightActive]);

  useEffect(() => {
    const navId = window.history.state?.__PRIVATE_NEXTJS_INTERNALS_NAV_ID;
    if (typeof navId === "number") {
      lastHistoryNavIdRef.current = navId;
    }
  }, [pathname]);

  useEffect(() => {
    const onPopState = () => {
      if (suppressNextPopRef.current) {
        suppressNextPopRef.current = false;
        const navId = window.history.state?.__PRIVATE_NEXTJS_INTERNALS_NAV_ID;
        if (typeof navId === "number") {
          lastHistoryNavIdRef.current = navId;
        }
        return;
      }

      const lockState = lockStateRef.current;
      const isLocked =
        lockState.isCarouselLab &&
        lockState.carouselMode === "block" &&
        lockState.isFlightActive;

      const navId = window.history.state?.__PRIVATE_NEXTJS_INTERNALS_NAV_ID;
      if (!isLocked) {
        if (typeof navId === "number") {
          lastHistoryNavIdRef.current = navId;
        }
        return;
      }

      const previousNavId = lastHistoryNavIdRef.current;
      const attemptedForward =
        typeof navId === "number" &&
        typeof previousNavId === "number" &&
        navId > previousNavId;

      suppressNextPopRef.current = true;
      window.history.go(attemptedForward ? -1 : 1);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.altKey) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (isNavigationLocked) return;
        router.back();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (isNavigationLocked) return;
        router.forward();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isNavigationLocked, router]);

  const handleShellClickCapture = (event) => {
    if (!isNavigationLocked || event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (!(event.target instanceof Element)) return;

    const anchor = event.target.closest("a[href]");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const target = anchor.getAttribute("target");
    if (target && target !== "_self") return;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash === window.location.hash
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="studio-shell" onClickCapture={handleShellClickCapture}>
      <header className="shell-header">
        <div className="shell-brand">
          <p className="eyebrow">next creative studio</p>
          <p className="title">Live Transition Playground</p>
        </div>

        <nav className="shell-nav">
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}
          >
            Control Room
          </Link>
          <Link
            href="/work"
            className={`nav-link ${pathname === "/work" ? "nav-link-active" : ""}`}
          >
            Work
          </Link>
          <Link
            href="/about"
            className={`nav-link ${pathname === "/about" ? "nav-link-active" : ""}`}
          >
            About
          </Link>
          <Link
            href="/carousel/a"
            className={`nav-link ${
              pathname.startsWith("/carousel") ? "nav-link-active" : ""
            }`}
          >
            Carousel Lab
          </Link>
        </nav>

        <div className="shell-controls">
          <button
            className="history-button"
            onClick={() => {
              if (isNavigationLocked) return;
              router.back();
            }}
          >
            Back
          </button>
          <button
            className="history-button"
            onClick={() => {
              if (isNavigationLocked) return;
              router.forward();
            }}
          >
            Forward
          </button>
        </div>

        {isCarouselLab ? (
          <div className="mode-switch">
            <button
              type="button"
              className={`mode-chip ${
                carouselMode === "interrupt" ? "mode-chip-active" : ""
              }`}
              onClick={() => {
                setCarouselMode("interrupt");
              }}
            >
              Interruptible
            </button>
            <button
              type="button"
              className={`mode-chip ${
                carouselMode === "block" ? "mode-chip-active" : ""
              }`}
              onClick={() => {
                setCarouselMode("block");
              }}
            >
              Non Interruptible
            </button>
          </div>
        ) : null}
      </header>

      <section className="stage-panel">
        <StudioStage
          action={nav?.action ?? "none"}
          direction={nav?.direction ?? "none"}
          flightRef={flightRef}
        />
        <div className="stage-hud">
          <span className="meta-pill">action: {nav?.action ?? "none"}</span>
          <span className="meta-pill">
            direction: {nav?.direction ?? "none"}
          </span>
          <span className="meta-pill">
            mode: {isCarouselLab ? carouselMode : "default"}
          </span>
          <span className="meta-pill">
            hotkeys: alt + ← / alt + → (browser history)
          </span>
        </div>
      </section>

      <TransitionBoundary
        transitions={studioTransitions}
        concurrency={{
          policy: contentPolicy,
          timeoutMs: isCarouselLab ? CAROUSEL_DURATION_MS + 360 : 950,
        }}
        render={(state) => (
          <ContentTransition
            {...state}
            isCarouselLab={isCarouselLab}
            carouselMode={carouselMode}
            flightRef={flightRef}
            onFlightStateChange={setIsFlightActive}
          />
        )}
      >
        {children}
      </TransitionBoundary>

      <TransitionBoundary
        concurrency={{ policy: "interrupt" }}
        render={(state) => <ModalTransition {...state} />}
      >
        {modal}
      </TransitionBoundary>
    </div>
  );
}
