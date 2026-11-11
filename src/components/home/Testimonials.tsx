import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { partners, testimonials } from "@/data/testimonials";
import { PARTNER_PLACEHOLDER_SLOTS } from "@/lib/constants/ui";

/**
 * 08 — Testimonials & partners (forest).
 * No invented quotes: until real, permitted testimonials exist, the section states the policy
 * itself, which doubles as a trust signal, and reserves quiet slots for partner marks.
 */
export function Testimonials() {
  const quote = testimonials[0];

  return (
    <Section tone="paper" aria-labelledby="voices-title">
      <Container grid className="gap-y-14">
        <h2 id="voices-title" className="sr-only">
          Client voices
        </h2>

        {quote ? (
          <figure className="col-span-full flex flex-col gap-10 lg:col-span-9 lg:col-start-3">
            <blockquote className="font-display text-display-lg">
              <p>&ldquo;{quote.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="label-mono text-fg-muted">
              {quote.author} · {quote.role}
            </figcaption>
          </figure>
        ) : (
          <div className="col-span-full flex flex-col gap-8 lg:col-span-9 lg:col-start-3">
            <TextReveal
              as="p"
              flowBelowLg
              className="font-display text-display-lg"
              lines={["We publish what our", "clients say only with", "*their permission.*"]}
            />
            <p className="max-w-md text-fg-muted">
              Testimonials from Meridian homeowners and partners will appear here as they are shared
              with us.
            </p>
          </div>
        )}

        <div className="col-span-full flex flex-col gap-6 border-t border-fg/15 pt-8">
          <p className="label-mono text-fg-muted">Partners</p>
          {partners.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-14 gap-y-8">
              {partners.map((partner) => (
                <li key={partner.id} className="text-fg/80">
                  {partner.name}
                </li>
              ))}
            </ul>
          ) : (
            <ul
              aria-label="Partner logos to be added"
              className="grid grid-cols-2 gap-px bg-fg/10 sm:grid-cols-5"
            >
              {Array.from({ length: PARTNER_PLACEHOLDER_SLOTS }, (_, i) => (
                <li
                  key={i}
                  className="flex h-16 items-center justify-center bg-surface label-mono text-fg-muted last:col-span-2 sm:last:col-span-1"
                >
                  Partner mark {i + 1}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
