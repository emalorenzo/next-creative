import Link from "next/link";
import { shots } from "./_components/shots";

export default function HomePage() {
  return (
    <section className="route-card">
      <header className="route-header">
        <p className="route-eyebrow">control room</p>
        <h1>Creative navigation for studio-grade experiences</h1>
        <p className="route-copy">
          Trigger fast route changes to force interruptions, then use browser
          back/forward to watch directional choreography and persistent WebGL
          stage updates.
        </p>
      </header>

      <div className="flow-grid">
        <article className="flow-card">
          <h2>Flow 1: Interrupt-safe exits</h2>
          <p>
            Switch quickly between <b>Work</b> and <b>About</b>. Exit ownership
            uses run tokens so stale callbacks never complete the wrong
            snapshot.
          </p>
          <div className="inline-links">
            <Link href="/work" className="inline-link">
              Jump to Work
            </Link>
            <Link href="/about" className="inline-link">
              Jump to About
            </Link>
          </div>
        </article>

        <article className="flow-card">
          <h2>Flow 2: Directional history</h2>
          <p>
            Use browser buttons, trackpad gestures, or hotkeys (`alt + ←` / `alt
            + →`) to see backward exits reverse their motion vectors.
          </p>
        </article>

        <article className="flow-card">
          <h2>Flow 5: 3s Carousel + 3D fly-through</h2>
          <p>
            Lab de navegación “picante”: transición de 3 segundos con doble DOM
            (saliente + entrante), objeto 3D en arco de izquierda a derecha y
            comparación entre modo interruptible y no interruptible.
          </p>
          <div className="inline-links">
            <Link href="/carousel/a" className="inline-link">
              Open Carousel Lab
            </Link>
          </div>
        </article>
      </div>

      <article className="flow-card">
        <h2>Flow 3 + 4: Persistent layout + intercepted modal</h2>
        <p>
          Open a shot from this list. The route updates to `/photos/[id]`, but
          inside this screen it intercepts into a modal while the background and
          persistent stage stay mounted.
        </p>

        <ul className="shot-grid">
          {shots.map((shot) => (
            <li key={shot.id}>
              <Link className="shot-card" href={`/photos/${shot.id}`}>
                <p className="shot-id">Shot {shot.id}</p>
                <h3>{shot.title}</h3>
                <p>{shot.client}</p>
                <p className="shot-summary">{shot.summary}</p>
                <p className="shot-tech">{shot.tech.join(" • ")}</p>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
