"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import type { CursorLabelProps } from "@/types/ui";

/**
 * A text label that follows the pointer while it is over the parent element (which must be
 * positioned and carry the `group/cursor` class). Shown on hover only; with a mouse it trails
 * the cursor, otherwise (and with reduced motion) it rests at the centre. Decorative.
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
      const place = (e: PointerEvent, jump: boolean) => {
        const r = host.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        if (jump) gsap.set(el, { x, y });
        xTo(x);
        yTo(y);
      };
      const onEnter = (e: PointerEvent) => place(e, true);
      const onMove = (e: PointerEvent) => place(e, false);
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointermove", onMove);
      return () => {
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointermove", onMove);
        gsap.set(el, { clearProps: "x,y" });
      };
    });
    return () => mm.revert();
  });

  return (
    <span
      aria-hidden="true"
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
