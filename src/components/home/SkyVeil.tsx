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
      // The backdrop frosts (tint + blur) as the content rises over it.
      const frost = backdrop.querySelector<HTMLElement>("[data-about-frost]");
      if (frost) {
        gsap.fromTo(
          frost,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            // From 5% to 45% of a screen after the hand-over: frosted before the text is mid-screen.
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${window.innerHeight * 0.05} top`,
              end: () => `+=${window.innerHeight * 0.4}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }
      return () =>
        gsap.set([backdrop, frost].filter(Boolean), { clearProps: "visibility,opacity" });
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className="absolute inset-0 motion-reduce:hidden">
      <Image src={HERO_MEDIA.posterSky} alt="" fill sizes="25vw" className="object-cover" />
    </div>
  );
}
