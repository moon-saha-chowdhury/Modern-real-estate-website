"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface SmoothScrollApi {
  /** Current Lenis instance, or null when smooth scrolling is disabled (reduced motion). */
  get: () => Lenis | null;
  lock: () => void;
  unlock: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Disabled entirely for prefers-reduced-motion (native scrolling).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      get: () => lenisRef.current,
      lock: () => {
        lenisRef.current?.stop();
        document.documentElement.style.overflow = "hidden";
      },
      unlock: () => {
        lenisRef.current?.start();
        document.documentElement.style.overflow = "";
      },
    }),
    [],
  );

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollApi {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScroll>");
  return ctx;
}
