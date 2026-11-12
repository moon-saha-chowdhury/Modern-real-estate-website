// import { BuildingTransformation } from "./BuildingTransformation";
import { TowerExplorer } from "./TowerExplorer";

/**
 * 01 — Hero. Now the tower explorer: hover a floor, choose it, see the residence.
 *
 * The previous hero (the scroll-scrubbed building transformation with the camera rise) is kept
 * in BuildingTransformation.tsx. To switch back: restore the import and the line below. (The
 * About section no longer overlaps the hero's last screen; the old sky hand-over is in git history.)
 */
export function HeroSection() {
  // return <BuildingTransformation title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
  return <TowerExplorer title={["Building spaces.", "Shaping", "*tomorrow.*"]} />;
}
