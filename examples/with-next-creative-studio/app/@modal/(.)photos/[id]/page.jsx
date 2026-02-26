"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getAdjacentShotIds, getShotById } from "../../../_components/shots";

export default function InterceptedPhotoModalPage() {
  const params = useParams();
  const router = useRouter();

  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const shot = id ? getShotById(id) : null;

  if (!shot) return null;

  const adjacent = getAdjacentShotIds(id);

  return (
    <div
      className="photo-modal-backdrop"
      onClick={() => {
        router.back();
      }}
      role="presentation"
    >
      <article
        className="photo-modal-sheet"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="photo-modal-header">
          <p className="route-eyebrow">intercepted modal</p>
          <h2>{shot.title}</h2>
          <p>{shot.client}</p>
        </header>

        <p className="route-copy">{shot.summary}</p>
        <p className="shot-tech">{shot.tech.join(" • ")}</p>

        <div className="inline-links">
          <Link href={`/photos/${adjacent.previous}`} className="inline-link">
            Previous
          </Link>
          <Link href={`/photos/${adjacent.next}`} className="inline-link">
            Next
          </Link>
          <button
            className="history-button"
            onClick={() => {
              router.back();
            }}
          >
            Close
          </button>
        </div>
      </article>
    </div>
  );
}
