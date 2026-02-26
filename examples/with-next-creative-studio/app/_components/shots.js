export const shots = [
  {
    id: "1",
    title: "Neon Brand Film",
    client: "Lumen Audio",
    summary: "Realtime product film with reactive particles and UI overlays.",
    tech: ["R3F", "Three.js", "GLSL"],
  },
  {
    id: "2",
    title: "Interactive Launch Tunnel",
    client: "Orion Mobility",
    summary: "Scroll-synced sequence blending DOM narrative with a 3D tunnel.",
    tech: ["Drei", "GSAP", "WebGL"],
  },
  {
    id: "3",
    title: "Museum Data Sculpture",
    client: "North Gallery",
    summary: "Data-driven sculpture reacting to live visitor activity.",
    tech: ["ShaderGraph", "Motion", "Audio"],
  },
  {
    id: "4",
    title: "Product Detail Microsite",
    client: "Astra Lighting",
    summary:
      "Crossfaded route transitions with persistent immersive camera rig.",
    tech: ["App Router", "R3F", "PostFX"],
  },
];

export function getShotById(id) {
  return shots.find((shot) => shot.id === String(id));
}

export function getAdjacentShotIds(id) {
  const currentIndex = shots.findIndex((shot) => shot.id === String(id));

  if (currentIndex === -1) {
    return {
      previous: shots[0].id,
      next: shots[1].id,
    };
  }

  return {
    previous: shots[(currentIndex - 1 + shots.length) % shots.length].id,
    next: shots[(currentIndex + 1) % shots.length].id,
  };
}
