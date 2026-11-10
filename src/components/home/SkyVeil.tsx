"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { HERO_MEDIA } from "@/lib/constants/hero";

/**
 * Hand-over from the hero to the About section.
 *
 * The About section overlaps the hero's last screen, with its backdrop hidden. The moment the
 * section reaches the top of the viewport (exactly when the hero's scroll ends on open sky) the
 * backdrop is switched on with this veil, the same sky, over it, so the switch is invisible.
 * The veil then fades out over under half a screen of scroll, revealing the finished tower.
 * Reduced motion: no overlap, no veil; the backdrop is simply visible.
 */
export function SkyVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const veil = ref.current;
    const backdrop = veil?.parentElement;
    const section = veil?.closest("section");
    if (!veil || !backdrop || !section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const show = (self: ScrollTrigger) =>
        gsap.set(backdrop, { visibility: self.isActive ? "visible" : "hidden" });
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onToggle: show,
        onRefresh: show,
      });
      gsap.fromTo(
        veil,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "+=45%", scrub: true },
        },
      );
      return () => gsap.set(backdrop, { clearProps: "visibility" });
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className="absolute inset-0 motion-reduce:hidden">
      <Image src={HERO_MEDIA.posterSky} alt="" fill sizes="25vw" className="object-cover" />
    </div>
  );
}
