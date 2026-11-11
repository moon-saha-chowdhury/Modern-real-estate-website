import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { TextReveal } from "@/components/common/TextReveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { company } from "@/data/company";
import { HERO_MEDIA } from "@/lib/constants/hero";

/**
 * 09 — Contact / partnership. The page ends where it began: on the blue dusk of the hero. The
 * same tower, mirrored and softly blurred, sits behind the statement and contact details; the
 * form rests on a white panel (a light surface of its own) so it reads as the place to act.
 */
export function ContactSection() {
  const { contact } = company;

  return (
    <section
      id="enquire"
      data-surface="blue"
      data-nav-blue="glass"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-twilight py-section text-fg"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={HERO_MEDIA.towerFinished}
          alt=""
          fill
          sizes="50vw"
          className="scale-110 -scale-x-100 object-cover blur-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-b from-twilight/60 via-ink/45 to-ink/80" />
      </div>

      <Container grid className="gap-y-16">
        <div className="col-span-full flex flex-col gap-10 lg:col-span-5">
          <TextReveal
            id="contact-title"
            className="font-display text-display-lg"
            lines={["Let's build", "something", "*meaningful.*"]}
          />
          <Reveal className="flex flex-col gap-10">
            <p className="max-w-sm text-lead text-fg-muted">
              Buying a home, visiting a site or bringing land to the table: tell us what you have in
              mind.
            </p>
            <div className="flex flex-col gap-3 border-t border-rule pt-6 text-small">
              {contact.email || contact.phone ? (
                <>
                  {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                  {contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
                </>
              ) : (
                <p className="text-fg-muted">Office phone and email will be published shortly.</p>
              )}
            </div>
          </Reveal>
        </div>

        <div
          data-surface="light"
          className="col-span-full self-start border border-rule bg-white p-6 text-fg sm:p-10 lg:col-span-6 lg:col-start-7"
        >
          <EnquiryForm />
        </div>
      </Container>
    </section>
  );
}
