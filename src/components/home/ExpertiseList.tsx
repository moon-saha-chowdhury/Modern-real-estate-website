import Image from "next/image";
import Link from "next/link";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { EXPERTISE_CARD_OFFSET_CLASSES, EXPERTISE_FLOAT_CLASSES } from "@/lib/constants/expertise";
import { cn } from "@/lib/utils/cn";
import { displayIndex } from "@/lib/utils/projects";
import type { ExpertiseListProps } from "@/types/sections";

/**
 * Capability cards with photographs passing over them.
 *
 * lg+ (motion allowed): the staggered cards pin under the navbar (CSS sticky inside this track)
 * while the photographs, laid out in normal flow after them at varied widths and positions,
 * scroll up over the cards. When the last photograph has passed, the cards scroll away.
 * Below lg, and with reduced motion: a plain card grid, each card carrying its photograph.
 */
export function ExpertiseList({ items }: ExpertiseListProps) {
  return (
    <div className="relative">
      <ol className="grid gap-4 md:grid-cols-2 lg:sticky lg:top-[calc(var(--spacing-nav)+0.75rem)] lg:grid-cols-3 lg:items-start lg:motion-reduce:static">
        {items.map((item, i) => (
          <li key={item.id} className={EXPERTISE_CARD_OFFSET_CLASSES[i % 3]}>
            <Link
              href={`/expertise#${item.id}`}
              className="group flex h-full flex-col gap-5 bg-paper p-6 transition-colors duration-500 ease-meridian hover:bg-white lg:min-h-[min(15rem,34svh)]"
            >
              <div className="relative aspect-3/2 overflow-hidden lg:hidden lg:motion-reduce:block">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-display text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-tight">
                {item.title}
              </h3>
              <p className="text-small text-fg-muted">{item.summary}</p>
              <span className="mt-auto self-end font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] text-fg-muted transition-colors duration-500 group-hover:text-accent">
                ({displayIndex(i)})
              </span>
            </Link>
            {/* Credit for the in-card photograph (the floating ones carry their own) */}
            <PhotoCredit
              image={item.image}
              className="mt-2 text-fg-muted lg:hidden lg:motion-reduce:block"
            />
          </li>
        ))}
      </ol>

      {/* Photographs in flow after the cards: they scroll over the pinned cards (lg+) */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-10 hidden flex-col gap-[22svh] pt-[12svh] pb-[85svh] lg:flex lg:motion-reduce:hidden"
      >
        {items.map((item, i) => (
          <figure
            key={item.id}
            className={cn(
              "flex flex-col gap-2",
              EXPERTISE_FLOAT_CLASSES[i % EXPERTISE_FLOAT_CLASSES.length],
            )}
          >
            <div className="relative aspect-4/3 overflow-hidden bg-stone shadow-[0_24px_60px_-30px_rgb(0_0_0/0.45)]">
              <Image src={item.image.src} alt="" fill sizes="36vw" className="object-cover" />
            </div>
            <PhotoCredit
              image={item.image}
              className="pointer-events-auto self-start bg-stone/85 px-2 text-fg-muted"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
