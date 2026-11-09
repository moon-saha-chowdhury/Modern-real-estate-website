"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { DURATION, EASE_MERIDIAN } from "@/lib/animations/eases";
import { cn } from "@/lib/utils/cn";
import { displayIndex } from "@/lib/utils/projects";
import type { ExpertiseListProps } from "@/types/sections";

/**
 * Rows on the right; on desktop a sticky photograph on the left follows the hovered or focused
 * row. On mobile the photo is dropped: the rows carry the section on their own.
 */
export function ExpertiseList({ items }: ExpertiseListProps) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="grid-editorial gap-y-10">
      <div className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-[calc(var(--spacing-nav)+2rem)] flex flex-col gap-3">
          <div className="relative aspect-[4/5] overflow-hidden bg-paper">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.reveal, ease: EASE_MERIDIAN }}
              >
                <Image
                  src={current.image.src}
                  alt={current.image.alt}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <span className="absolute top-4 left-4 bg-obsidian/80 px-2 py-1 label-mono text-ivory">
              Fig. {displayIndex(active)}
            </span>
          </div>
          <PhotoCredit image={current.image} className="text-fg-muted" />
        </div>
      </div>

      <ol className="col-span-full border-t border-fg/15 lg:col-span-7 lg:col-start-6">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <li key={item.id} className="border-b border-fg/15">
              <Link
                href={`/expertise#${item.id}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-3 py-7 md:grid-cols-[3.5rem_1fr_auto] lg:py-9"
              >
                <span
                  className={cn(
                    "label-mono transition-colors duration-300",
                    isActive ? "text-accent" : "text-fg-muted",
                  )}
                >
                  {displayIndex(i)}
                </span>
                <span
                  className={cn(
                    "font-display text-display-sm transition-[color,translate] duration-500 ease-meridian",
                    isActive ? "text-fg lg:translate-x-2" : "text-fg/70",
                  )}
                >
                  {item.title}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className={cn(
                    "size-5 self-center transition-[color,translate] duration-500 ease-meridian",
                    isActive ? "text-accent" : "text-fg/30",
                  )}
                />
                <span className="col-start-2 max-w-xl text-small text-fg-muted">
                  {item.summary}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
