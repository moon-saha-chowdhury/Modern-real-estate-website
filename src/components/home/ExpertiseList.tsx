import Image from "next/image";
import Link from "next/link";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { EXPERTISE_CARD_OFFSET_CLASSES, EXPERTISE_PHOTO_CLASSES } from "@/lib/constants/expertise";
import { cn } from "@/lib/utils/cn";
import { displayIndex } from "@/lib/utils/projects";
import type { ExpertiseListProps } from "@/types/sections";

/**
 * Capability cards with photographs passing over them.
 *
 * lg+ (motion allowed): the staggered cards pin under the navbar (CSS sticky inside this track)
 * while the four photographs, in normal flow after them (wide, narrow, narrow, wide), scroll up
 * over the cards. When the last photograph has passed, the cards scroll away.
 * Below lg, and with reduced motion: the card grid, then the photographs as a collage.
 */
export function ExpertiseList({ items, photos }: ExpertiseListProps) {
  return (
    <div className="relative">
      <ol className="grid gap-4 md:grid-cols-2 lg:sticky lg:top-[calc(var(--spacing-nav)+0.75rem)] lg:grid-cols-3 lg:items-start lg:motion-reduce:static">
        {items.map((item, i) => (
          <li key={item.id} className={EXPERTISE_CARD_OFFSET_CLASSES[i % 3]}>
            <Link
              href={`/expertise#${item.id}`}
              className="group flex h-full flex-col gap-5 bg-paper p-6 transition-colors duration-500 ease-meridian hover:bg-white lg:min-h-[min(15rem,34svh)]"
            >
              <h3 className="font-display text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-tight">
                {item.title}
              </h3>
              <p className="text-small text-fg-muted">{item.summary}</p>
              <span className="mt-auto self-end font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] text-fg-muted transition-colors duration-500 group-hover:text-accent">
                ({displayIndex(i)})
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Photographs: a collage below lg; from lg they scroll over the pinned cards */}
      <div className="pointer-events-none relative z-10 mt-8 grid grid-cols-2 gap-4 lg:mt-0 lg:block lg:pt-[10svh] lg:pb-[85svh] lg:motion-reduce:mt-8 lg:motion-reduce:grid lg:motion-reduce:p-0">
        {photos.slice(0, EXPERTISE_PHOTO_CLASSES.length).map((photo, i) => (
          <figure
            key={photo.src}
            className={cn(
              "flex flex-col gap-2 lg:motion-reduce:m-0 lg:motion-reduce:w-auto",
              EXPERTISE_PHOTO_CLASSES[i].frame,
            )}
          >
            <div
              className={cn(
                "relative overflow-hidden bg-stone lg:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.45)]",
                EXPERTISE_PHOTO_CLASSES[i].image,
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
            </div>
            <PhotoCredit
              image={photo}
              className="pointer-events-auto self-start text-fg-muted lg:bg-stone/85 lg:px-2"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
