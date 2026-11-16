// import { BuildingTransformation } from "./BuildingTransformation";
import { TowerExplorer } from "./TowerExplorer";

/**
 * 01 — Hero. Now the tower explorer: hover a floor, choose it, see the residence.
 *
 * The previous hero (the scroll-scrubbed building transformation with the camera rise) is kept
 * in BuildingTransformation.tsx. To switch back: restore the import and the line below, and
 * drop `handover="none"` from <BrandIntroduction /> in src/app/page.tsx.
 */
export function HeroSection() {
  // return <BuildingTransformation title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
  return <TowerExplorer title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
}
