/** Panorama tour viewer settings (see components/virtual-tour). */
export const TOUR = {
  /** Phones load the 2048 px panorama, everything else the 4096 px one. */
  mobileQuery: "(max-width: 767px)",
  /** Start zoom, 0 = widest field of view, 100 = closest. */
  defaultZoom: 10,
  /** Seconds the cross-fade between rooms takes (none with reduced motion). */
  transitionMs: 1000,
} as const;
