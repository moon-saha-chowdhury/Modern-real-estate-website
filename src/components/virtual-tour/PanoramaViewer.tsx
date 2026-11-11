"use client";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { Viewer } from "@photo-sphere-viewer/core";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TOUR } from "@/lib/constants/tour";
import { cn } from "@/lib/utils/cn";
import type { PanoramaScene } from "@/types/project";
import type { PanoramaViewerProps } from "@/types/sections";

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

/** Phones get the 2048 px panorama when there is one. */
const sourceOf = (scene: PanoramaScene) =>
  window.matchMedia(TOUR.mobileQuery).matches && scene.srcMobile ? scene.srcMobile : scene.src;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const markersOf = (scene: PanoramaScene) =>
  (scene.hotspots ?? []).map((hotspot, i) => ({
    id: `${scene.id}:${i}:${hotspot.toSceneId}`,
    position: { yaw: `${hotspot.yaw}deg`, pitch: `${hotspot.pitch}deg` },
    anchor: "center center",
    html: `<span class="tour-hotspot"><span class="tour-hotspot__dot" aria-hidden="true">→</span>${escapeHtml(hotspot.label)}</span>`,
    data: { toSceneId: hotspot.toSceneId },
  }));

/**
 * The 360° viewer (Photo Sphere Viewer on three.js). Loaded only after the visitor enters the
 * tour, never with the page. The room chips are ordinary buttons, so rooms can be changed
 * without the pointer; hotspots inside the panorama lead to the same rooms.
 *
 * Page scrolling is not hijacked: zoom needs Ctrl + wheel, and touch needs two fingers.
 */
export default function PanoramaViewer({ scenes, label, onExit }: PanoramaViewerProps) {
  const container = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const markers = useRef<MarkersPlugin | null>(null);
  const shown = useRef(0);
  const [index, setIndex] = useState(0);

  // Create the viewer once, on the first room.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const first = scenes[0];
    const instance = new Viewer({
      container: el,
      panorama: sourceOf(first),
      defaultYaw: `${first.initialYaw ?? 0}deg`,
      defaultPitch: 0,
      defaultZoomLvl: TOUR.defaultZoom,
      mousewheelCtrlKey: true,
      touchmoveTwoFingers: true,
      keyboard: "always",
      navbar: ["zoom", "move", "gyroscope", "fullscreen"],
      loadingTxt: "Loading the room",
      plugins: [[MarkersPlugin, { markers: markersOf(first) }], GyroscopePlugin],
    });
    const plugin = instance.getPlugin<MarkersPlugin>(MarkersPlugin);
    plugin.addEventListener("select-marker", ({ marker }) => {
      const target = scenes.findIndex((scene) => scene.id === marker.data?.toSceneId);
      if (target >= 0) setIndex(target);
    });
    viewer.current = instance;
    markers.current = plugin;
    return () => {
      instance.destroy();
      viewer.current = null;
      markers.current = null;
    };
  }, [scenes]);

  // Go to the chosen room (from a chip or a hotspot).
  useEffect(() => {
    const instance = viewer.current;
    const plugin = markers.current;
    if (!instance || !plugin || index === shown.current) return;
    shown.current = index;
    const scene = scenes[index];
    plugin.clearMarkers();
    void instance
      .setPanorama(sourceOf(scene), {
        position: { yaw: `${scene.initialYaw ?? 0}deg`, pitch: 0 },
        transition: reducedMotion()
          ? false
          : { effect: "fade", speed: TOUR.transitionMs, rotation: false },
      })
      .then(() => plugin.setMarkers(markersOf(scene)));
  }, [index, scenes]);

  return (
    <div
      className="absolute inset-0"
      role="region"
      aria-label={label}
      onKeyDown={(event) => event.key === "Escape" && onExit()}
    >
      <div ref={container} className="absolute inset-0" />

      <button
        type="button"
        onClick={onExit}
        className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 border border-white/35 bg-ink/45 px-3 py-2 label-mono text-white backdrop-blur-md transition-colors duration-300 hover:bg-ink/70 md:top-6 md:left-6"
      >
        <X aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        Exit tour
      </button>

      {scenes.length > 1 && (
        <nav
          aria-label="Rooms"
          className="absolute inset-x-4 bottom-14 z-10 flex flex-wrap gap-2 md:bottom-16 md:left-6"
        >
          {scenes.map((scene, i) => (
            <button
              key={scene.id}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "border px-3 py-2 label-mono backdrop-blur-md transition-colors duration-300",
                i === index
                  ? "border-white bg-white text-ink"
                  : "border-white/35 bg-ink/45 text-white hover:bg-ink/70",
              )}
            >
              {scene.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
