import { BuildingTransformation } from "./BuildingTransformation";

/**
 * 01 — Cinematic hero. Full-bleed, scroll-scrubbed building transformation with a single
 * title over the sky. The split text/video layout from Milestone 2 has been retired.
 */
export function HeroSection() {
  return <BuildingTransformation title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
}
