"use client";

import Link from "next/link";

export default function CarouselPageA() {
  return (
    <section className="route-card carousel-card carousel-card-a">
      <header className="route-header">
        <p className="route-eyebrow">carousel page a</p>
        <h1>Scene A: kinetic launch board</h1>
        <p className="route-copy">
          Este layout está pensado para transicionar con un timeline de 3
          segundos. Durante ese tiempo conviven DOM saliente y entrante,
          mientras el objeto 3D cruza en arco hacia la esquina derecha.
        </p>
      </header>

      <div className="carousel-grid">
        <article className="flow-card">
          <h2>Test interrupt</h2>
          <p>
            Navegá de A a B y meté back del browser a mitad de animación. En
            `interrupt`, B sale y entra un nuevo A desde la derecha.
          </p>
        </article>
        <article className="flow-card">
          <h2>Test block</h2>
          <p>
            Cambiá a `non interruptible` en el header y repetí. Aunque hagas
            back durante la animación, visualmente la corrida actual se mantiene
            hasta finalizar.
          </p>
        </article>
      </div>

      <div className="inline-links">
        <Link href="/carousel/b" className="inline-link">
          Navigate to Page B
        </Link>
        <Link href="/carousel/a" className="inline-link">
          Replay A Transition
        </Link>
        <Link href="/" className="inline-link">
          Exit Lab
        </Link>
      </div>
    </section>
  );
}
