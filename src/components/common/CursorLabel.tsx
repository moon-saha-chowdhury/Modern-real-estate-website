"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import type { CursorLabelProps } from "@/types/ui";

/**
 * A text label that follows the pointer while it is over the host element (the wrapper's parent,
 * which must be positioned and carry the `group/cursor` class). Shown on hover only; with a
 * mouse it trails the cursor, otherwise (and with reduced motion) it rests at the centre.
 *
 * The pointer is tracked on the window, not the host: when the page scrolls under a resting
 * cursor no pointer event fires on the newly hovered host, so the position is also recomputed
 * on scroll. Decorative.
 */
export function CursorLabel({ label }: CursorLabelProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    // el is the moving label; its wrapper centres it; the wrapper sits inside the host.
    const host = el?.parentElement?.parentElement;
    if (!el || !host) return;

    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      const pointer = { x: -1, y: -1 };
      let inside = false;

      /** `glide`: ease towards the pointer (mouse moved) instead of snapping (page scrolled). */
      const place = (glide: boolean) => {
        const r = host.getBoundingClientRect();
        const over =
          pointer.x >= r.left &&
          pointer.x <= r.right &&
          pointer.y >= r.top &&
          pointer.y <= r.bottom;
        if (!over) {
          inside = false;
          return;
        }
        const x = pointer.x - r.left - r.width / 2;
        const y = pointer.y - r.top - r.height / 2;
        if (!inside || !glide) gsap.set(el, { x, y });
        xTo(x);
        yTo(y);
        inside = true;
      };

      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        place(true);
      };
      const onScroll = () => place(false);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        gsap.set(el, { clearProps: "x,y" });
      };
    });
    return () => mm.revert();
  });

  return (
    <span
      aria-hidden="true"
      data-cursor-label
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-1/2 opacity-0 transition-opacity duration-300 ease-meridian group-hover/cursor:opacity-100"
    >
      <span
        ref={ref}
        className="block border-b border-current/60 pb-1.5 text-lead tracking-wide whitespace-nowrap uppercase"
      >
        {label}
      </span>
    </span>
  );
}
