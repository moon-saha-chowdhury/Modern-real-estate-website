"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { HERO_MEDIA } from "@/lib/constants/hero";

/**
 * The hero's closing sky, laid over the About backdrop. Once the About section reaches the top
 * of the viewport it fades out over half a screen of scroll, revealing the finished tower
 * behind: the short hand-over between the hero's camera rise and the About content.
 * Reduced motion: not shown (the tower is visible straight away).
 */
export function SkyVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const veil = ref.current;
    const section = veil?.closest("section");
    if (!veil || !section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        veil,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "+=50%", scrub: true },
        },
      );
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className="absolute inset-0 motion-reduce:hidden">
      <Image src={HERO_MEDIA.posterSky} alt="" fill sizes="25vw" className="object-cover" />
    </div>
  );
}
