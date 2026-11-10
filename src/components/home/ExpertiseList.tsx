"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { displayIndex } from "@/lib/utils/projects";
import type { ExpertiseListProps } from "@/types/sections";

/**
 * Sticky photograph + scrolling list.
 *
 * lg+: one tall photograph stays pinned on the left (CSS sticky) while the capabilities scroll
 * past on the right. The row crossing the middle of the viewport becomes active: its photograph
 * cross-fades in and its text comes to full strength. The active row is written to
 * data-attributes by an IntersectionObserver (no React state, no scroll handler).
 * Below lg: each row carries its own photograph; nothing is pinned.
 */
export function ExpertiseList({ items }: ExpertiseListProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = [...el.querySelectorAll<HTMLElement>("[data-row]")];
    const slides = [...el.querySelectorAll<HTMLElement>("[data-slide]")];
    const figure = el.querySelector<HTMLElement>("[data-figure]");

    const activate = (index: number) => {
      rows.forEach((row, i) => (row.dataset.active = String(i === index)));
      slides.forEach((slide, i) => (slide.dataset.active = String(i === index)));
      if (figure) figure.textContent = `Fig. ${displayIndex(index)}`;
    };

    // A line across the middle of the viewport: the row crossing it is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activate(rows.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className="grid-editorial gap-y-10">
      {/* Pinned photograph (lg+): all slides stacked, the active one visible */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--spacing-nav)+2rem)]">
          <div className="relative aspect-4/5 max-h-[calc(100svh-var(--spacing-nav)-4rem)] w-full overflow-hidden bg-paper">
            {items.map((item, i) => (
              <div
                key={item.id}
                data-slide
                data-active={i === 0}
                className="absolute inset-0 scale-[1.04] opacity-0 transition-[opacity,scale] duration-[900ms] ease-meridian data-[active=true]:scale-100 data-[active=true]:opacity-100"
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="40vw"
                  quality={90}
                  className="object-cover"
                />
                <PhotoCredit
                  image={item.image}
                  className="absolute bottom-0 left-0 bg-obsidian/75 px-2 text-ivory"
                />
              </div>
            ))}
            <span
              data-figure
              aria-hidden="true"
              className="absolute top-4 left-4 bg-obsidian/80 px-2 py-1 label-mono text-ivory"
            >
              Fig. 01
            </span>
          </div>
        </div>
      </div>

      <ol className="col-span-full lg:col-span-6 lg:col-start-7">
        {items.map((item, i) => (
          <li
            key={item.id}
            data-row
            data-active={i === 0}
            className="group/row border-t border-fg/15 last:border-b lg:flex lg:min-h-[52svh] lg:items-center"
          >
            <div className="flex w-full flex-col gap-5 py-8 lg:py-12">
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="relative aspect-3/2 overflow-hidden bg-paper">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="94vw"
                    className="object-cover"
                  />
                </div>
                <PhotoCredit image={item.image} className="text-fg-muted" />
              </div>
              <Link
                href={`/expertise#${item.id}`}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-4 transition-opacity duration-500 ease-meridian md:grid-cols-[3.5rem_1fr_auto] lg:opacity-35 lg:group-data-[active=true]/row:opacity-100"
              >
                <span className="label-mono text-accent">{displayIndex(i)}</span>
                <h3 className="font-display text-display-sm">{item.title}</h3>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-5 self-center text-fg/40 transition-[color,translate] duration-500 ease-meridian group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
                <p className="col-start-2 max-w-xl text-fg-muted">{item.summary}</p>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
