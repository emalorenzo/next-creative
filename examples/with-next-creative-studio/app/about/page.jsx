import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="route-card">
      <header className="route-header">
        <p className="route-eyebrow">about</p>
        <h1>Why this pattern matters</h1>
      </header>

      <ul className="principle-list">
        <li>
          Keep cinematic layers persistent (`Canvas`, HUD, audio, shaders) while
          only route content ownership transitions.
        </li>
        <li>
          Use directional history signals to avoid disorienting backward motion.
        </li>
        <li>
          Preserve URL truth with intercepted modal routes instead of local-only
          UI state.
        </li>
        <li>
          Handle interruption safely so rapid user input never leaks stale exit
          callbacks.
        </li>
      </ul>

      <div className="inline-links">
        <Link href="/" className="inline-link">
          Return to control room
        </Link>
        <Link href="/photos/2" className="inline-link">
          Open modal flow
        </Link>
      </div>
    </section>
  );
}
