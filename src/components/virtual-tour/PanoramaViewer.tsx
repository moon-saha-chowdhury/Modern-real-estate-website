"use client";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { Viewer } from "@photo-sphere-viewer/core";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import Image from "next/image";
import Link from "next/link";
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

/** Run `task` when the browser is idle (or after a moment); returns a cancel function. */
function whenIdle(task: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task);
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 1500);
  return () => window.clearTimeout(id);
}

/** Keep the address bar on the current room (`?room=bedroom`) so it can be shared. */
function setRoomInUrl(roomId: string | null) {
  const url = new URL(window.location.href);
  if (roomId) url.searchParams.set("room", roomId);
  else url.searchParams.delete("room");
  window.history.replaceState(window.history.state, "", url);
}

/**
 * The 360° viewer (Photo Sphere Viewer on three.js). Loaded only after the visitor enters the
 * tour, never with the page. Rooms can be changed from the room buttons, the mini-map or the
 * hotspots inside the panorama; the first two are plain buttons, so no pointer is needed. The
 * rooms this one links to are fetched while the browser is idle, and the URL follows the room.
 *
 * Page scrolling is not hijacked: zoom needs Ctrl + wheel, and touch needs two fingers.
 */
export default function PanoramaViewer({
  scenes,
  label,
  plan,
  initialRoom,
  onExit,
}: PanoramaViewerProps) {
  const container = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const markers = useRef<MarkersPlugin | null>(null);
  // The first room is fixed when the viewer opens (a ?room= link can pick one).
  const [startIndex] = useState(() =>
    Math.max(
      0,
      scenes.findIndex((s) => s.id === initialRoom),
    ),
  );
  const shown = useRef(startIndex);
  const [index, setIndex] = useState(startIndex);
  const scene = scenes[index];

  // Create the viewer once, on the first room.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const first = scenes[startIndex];
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
      const target = scenes.findIndex((s) => s.id === marker.data?.toSceneId);
      if (target >= 0) setIndex(target);
    });
    viewer.current = instance;
    markers.current = plugin;
    return () => {
      instance.destroy();
      viewer.current = null;
      markers.current = null;
    };
  }, [scenes, startIndex]);

  // Go to the chosen room (from a button, the map or a hotspot).
  useEffect(() => {
    const instance = viewer.current;
    const plugin = markers.current;
    if (!instance || !plugin || index === shown.current) return;
    shown.current = index;
    const next = scenes[index];
    plugin.clearMarkers();
    void instance
      .setPanorama(sourceOf(next), {
        position: { yaw: `${next.initialYaw ?? 0}deg`, pitch: 0 },
        transition: reducedMotion()
          ? false
          : { effect: "fade", speed: TOUR.transitionMs, rotation: false },
      })
      .then(() => plugin.setMarkers(markersOf(next)));
  }, [index, scenes]);

  // The address bar follows the room; leaving the tour removes it again.
  useEffect(() => {
    setRoomInUrl(scene.id);
  }, [scene.id]);
  useEffect(() => () => setRoomInUrl(null), []);

  // While the browser is idle, fetch the rooms this one links to.
  useEffect(() => {
    return whenIdle(() => {
      for (const hotspot of scene.hotspots ?? []) {
        const target = scenes.find((s) => s.id === hotspot.toSceneId);
        if (target) new window.Image().src = sourceOf(target);
      }
    });
  }, [scene, scenes]);

  return (
    <div
      className="absolute inset-0"
      role="region"
      aria-label={label}
      onKeyDown={(event) => event.key === "Escape" && onExit()}
    >
      <div ref={container} className="absolute inset-0" />

      {/* Announces the room to screen readers when it changes */}
      <p className="sr-only" aria-live="polite">
        {scene.label}. {scene.description}
      </p>

      <button
        type="button"
        onClick={onExit}
        className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 border border-white/35 bg-ink/45 px-3 py-2 label-mono text-white backdrop-blur-md transition-colors duration-300 hover:bg-ink/70 md:top-6 md:left-6"
      >
        <X aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        Exit tour
      </button>
      <Link
        href="/contact"
        className="absolute top-4 right-4 z-10 border border-white/35 bg-white px-3 py-2 label-mono text-ink transition-colors duration-300 hover:bg-ivory md:top-6 md:right-6"
      >
        Book a visit
      </Link>

      {scene.description && (
        <p className="pointer-events-none absolute bottom-[7.75rem] left-6 z-10 hidden max-w-sm text-small text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.6)] md:block">
          {scene.description}
        </p>
      )}

      {scenes.length > 1 && (
        <nav
          aria-label="Rooms"
          className="absolute inset-x-4 bottom-14 z-10 flex flex-wrap gap-2 md:right-auto md:bottom-16 md:left-6"
        >
          {scenes.map((room, i) => (
            <button
              key={room.id}
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
              {room.label}
            </button>
          ))}
        </nav>
      )}

      {plan && (
        <div className="absolute right-6 bottom-16 z-10 hidden w-56 border border-white/35 bg-ink/45 p-3 backdrop-blur-md md:block">
          <div className="relative">
            <Image
              src={plan.src}
              alt=""
              width={plan.width}
              height={plan.height}
              unoptimized
              className="w-full opacity-80"
            />
            {scenes.map(
              (room, i) =>
                room.mapPoint && (
                  <button
                    key={room.id}
                    type="button"
                    aria-label={`Go to ${room.label}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                    style={{ left: `${room.mapPoint.x}%`, top: `${room.mapPoint.y}%` }}
                    className={cn(
                      "absolute size-3 -translate-1/2 rounded-full border border-white transition-[background-color,scale] duration-300",
                      i === index ? "scale-150 bg-white" : "bg-white/20 hover:bg-white/60",
                    )}
                  />
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
