"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { Orbit } from "lucide-react";
import { SampleBadge } from "@/components/common/SampleBadge";
import type { PanoramaTourProps } from "@/types/sections";

/** three.js and the viewer are fetched only when the visitor enters the tour. */
const PanoramaViewer = dynamic(() => import("./PanoramaViewer"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center label-mono text-white">
      Loading the tour…
    </div>
  ),
});

/**
 * Click-to-load 360° tour. Until the visitor presses "Enter the tour" this is a still and a
 * button: no WebGL, no three.js, nothing that touches the page's load or scroll.
 */
export function PanoramaTour({ scenes, poster, label, isIllustrative }: PanoramaTourProps) {
  const [entered, setEntered] = useState(false);

  return (
    <div
      data-surface="blue"
      className="relative isolate h-[min(82svh,46rem)] min-h-[26rem] w-full overflow-hidden bg-ink text-fg"
    >
      {entered ? (
        <PanoramaViewer scenes={scenes} label={label} onExit={() => setEntered(false)} />
      ) : (
        <>
          <Image
            src={poster.src}
            alt={poster.alt}
            fill
            sizes="(min-width: 1440px) 1360px, 94vw"
            className="-z-10 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-ink/60 via-ink/10 to-ink/30"
          />
          {isIllustrative && (
            <SampleBadge
              label="Illustrative tour"
              className="absolute top-4 left-4 border-ivory/30 bg-obsidian/75 text-ivory md:top-6 md:left-6"
            />
          )}
          <button
            type="button"
            onClick={() => setEntered(true)}
            className="group absolute top-1/2 left-1/2 flex -translate-1/2 items-center gap-4 border border-white/40 bg-ink/40 px-6 py-4 text-lead whitespace-nowrap text-white backdrop-blur-md transition-colors duration-500 ease-meridian hover:bg-ink/65"
          >
            <Orbit aria-hidden="true" className="size-6" strokeWidth={1.25} />
            Enter the tour
          </button>
          <p className="absolute inset-x-4 bottom-5 label-mono text-fg-muted md:inset-x-6">
            360° · {scenes.length} {scenes.length === 1 ? "room" : "rooms"} · drag to look around
          </p>
        </>
      )}
    </div>
  );
}
