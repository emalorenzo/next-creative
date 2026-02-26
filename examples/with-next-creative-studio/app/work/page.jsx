import Link from "next/link";
import { shots } from "../_components/shots";

export default function WorkPage() {
  return (
    <section className="route-card">
      <header className="route-header">
        <p className="route-eyebrow">work</p>
        <h1>Production-ready creative direction</h1>
        <p className="route-copy">
          Persistent stage, controlled exit ownership, and URL-driven modal
          overlays make it practical to ship high-polish studio sites without
          layout remount glitches.
        </p>
      </header>

      <div className="flow-grid">
        {shots.slice(0, 3).map((shot) => (
          <article key={shot.id} className="flow-card">
            <p className="shot-id">Case {shot.id}</p>
            <h2>{shot.title}</h2>
            <p>{shot.summary}</p>
            <Link href={`/photos/${shot.id}`} className="inline-link">
              Open as routed modal
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
