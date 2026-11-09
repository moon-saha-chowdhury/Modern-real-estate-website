/**
 * Building transformation frame.
 * Milestone 3 replaces the drawing grid with the scroll-scrubbed Veo video (GSAP ScrollTrigger).
 * Until the video is supplied, this is an honest placeholder: a drafting grid, not a fake render.
 */
export function BuildingTransformation() {
  return (
    <figure className="relative aspect-[4/5] w-full border border-line bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:48px_48px]">
      <span className="absolute top-6 left-6 label-mono text-champagne">Fig. 01 — Elevation</span>
      <figcaption className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-mist">
        <span className="label-mono">Building transformation</span>
        <span className="label-mono">Video pending</span>
      </figcaption>
    </figure>
  );
}
