import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentShotIds, getShotById } from "../../_components/shots";

export default async function PhotoPage({ params }) {
  const { id } = await params;
  const shot = getShotById(id);

  if (!shot) notFound();

  const adjacent = getAdjacentShotIds(id);

  return (
    <section className="route-card">
      <header className="route-header">
        <p className="route-eyebrow">photo route (full page)</p>
        <h1>{shot.title}</h1>
        <p className="route-copy">{shot.summary}</p>
      </header>

      <article className="flow-card">
        <p>
          This is the canonical route payload at <code>/photos/{shot.id}</code>.
          When visited from the control room, this same URL is intercepted into
          the modal slot.
        </p>
        <p className="shot-tech">{shot.tech.join(" • ")}</p>
      </article>

      <div className="inline-links">
        <Link href={`/photos/${adjacent.previous}`} className="inline-link">
          Previous shot
        </Link>
        <Link href={`/photos/${adjacent.next}`} className="inline-link">
          Next shot
        </Link>
        <Link href="/" className="inline-link">
          Back to control room
        </Link>
      </div>
    </section>
  );
}
