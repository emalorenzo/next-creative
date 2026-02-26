"use client";

import Link from "next/link";

export default function CarouselPageB() {
  return (
    <section className="route-card carousel-card carousel-card-b">
      <header className="route-header">
        <p className="route-eyebrow">carousel page b</p>
        <h1>Scene B: editorial sequence frame</h1>
        <p className="route-copy">
          Esta vista usa la misma coreografía 3D+DOM. Lo importante es la
          ownership explícita de ambas páginas para armar un “carousel handoff”
          real entre estados.
        </p>
      </header>

      <div className="carousel-grid">
        <article className="flow-card">
          <h2>Forward loop</h2>
          <p>
            Repetí A/B varias veces rápido para forzar interrupciones y ver que
            no quedan callbacks stale cerrando la transición equivocada.
          </p>
        </article>
        <article className="flow-card">
          <h2>History stress test</h2>
          <p>
            Usá navegador, trackpad o `alt + ←/→` durante la transición larga
            para comparar claramente `interrupt` versus `block`.
          </p>
        </article>
      </div>

      <div className="inline-links">
        <Link href="/carousel/a" className="inline-link">
          Navigate to Page A
        </Link>
        <Link href="/carousel/b" className="inline-link">
          Replay B Transition
        </Link>
        <Link href="/" className="inline-link">
          Exit Lab
        </Link>
      </div>
    </section>
  );
}
