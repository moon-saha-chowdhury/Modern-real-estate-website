// import { BuildingTransformation } from "./BuildingTransformation";
// import { TowerExplorer } from "./TowerExplorer";
import { ReelHero } from "./ReelHero";

/**
 * 01 — Hero. Now the scroll film (ReelHero); the click-driven TowerExplorer is kept beside it.
 *
 * The previous hero (the scroll-scrubbed building transformation with the camera rise) is kept
 * in BuildingTransformation.tsx. To switch back: restore the import and the line below, and
 * drop `handover="none"` from <BrandIntroduction /> in src/app/page.tsx.
 */
export function HeroSection() {
  // return <BuildingTransformation title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
  // return <TowerExplorer title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
  return <ReelHero title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
}
