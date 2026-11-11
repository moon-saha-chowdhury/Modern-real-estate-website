import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { partners, testimonials } from "@/data/testimonials";
import { PARTNER_PLACEHOLDER_SLOTS } from "@/lib/constants/ui";

/**
 * 08 — Testimonials & partners (paper). One large quote, the others in two columns beneath it,
 * then the partners. Sample quotes and partners carry a "Sample" label; with none at all the
 * section states its policy instead and reserves quiet slots for partner marks.
 */
export function Testimonials() {
  const [featured, ...others] = testimonials;
  const sample = testimonials.some((quote) => quote.isSample);
  const samplePartners = partners.some((partner) => partner.isSample);

  return (
    <Section tone="paper" aria-labelledby="voices-title">
      <Container grid className="gap-y-14">
        <h2 id="voices-title" className="sr-only">
          Client voices
        </h2>

        {featured ? (
          <>
            <figure className="col-span-full flex flex-col gap-10 lg:col-span-9 lg:col-start-3">
              <blockquote className="font-display text-display-md">
                <p>&ldquo;{featured.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="label-mono text-fg-muted">
                {featured.author} · {featured.role}
              </figcaption>
            </figure>

            {others.length > 0 && (
              <ul className="col-span-full grid gap-x-10 gap-y-10 border-t border-fg/15 pt-10 md:grid-cols-2 lg:col-span-9 lg:col-start-3">
                {others.map((quote, i) => (
                  <li key={quote.id}>
                    <Reveal delay={i * 0.08}>
                      <figure className="flex flex-col gap-5">
                        <blockquote className="text-lead">
                          <p>&ldquo;{quote.quote}&rdquo;</p>
                        </blockquote>
                        <figcaption className="label-mono text-fg-muted">
                          {quote.author} · {quote.role}
                        </figcaption>
                      </figure>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
            {sample && (
              <div className="col-span-full lg:col-span-9 lg:col-start-3">
                <SampleBadge label="Sample testimonials" className="text-fg-muted" />
              </div>
            )}
          </>
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label-mono text-fg-muted">Partners</p>
            {samplePartners && <SampleBadge label="Sample partners" className="text-fg-muted" />}
          </div>
          {partners.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-14 gap-y-6 font-display text-display-sm text-fg/80">
              {partners.map((partner) => (
                <li key={partner.id}>{partner.name}</li>
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
