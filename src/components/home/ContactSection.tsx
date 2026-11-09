import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { company } from "@/data/company";
import { media } from "@/data/media";

/**
 * 09 — Contact / partnership (obsidian, cinematic).
 * A night photograph fills the section and falls away into obsidian; the headline sits over the
 * lit building, and the form rests on a solid panel so it never competes with the image.
 */
export function ContactSection() {
  const image = media.contact;
  const { contact } = company;

  return (
    <Section
      tone="obsidian"
      spacing="none"
      id="enquire"
      aria-labelledby="contact-title"
      className="overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={image.src} alt="" fill sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-obsidian)_0%,color-mix(in_oklab,var(--color-obsidian)_70%,transparent)_45%,color-mix(in_oklab,var(--color-obsidian)_85%,transparent)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,var(--color-obsidian),transparent)]" />
      </div>

      <Container grid className="gap-y-16 py-section">
        <div className="col-span-full flex flex-col justify-between gap-12 lg:col-span-5">
          <div className="flex flex-col gap-10">
            <Eyebrow index="09" className="text-champagne">
              Enquire
            </Eyebrow>
            <TextReveal
              id="contact-title"
              className="font-display text-display-lg"
              lines={[
                "Let's build",
                "something",
                <>
                  <em className="text-champagne">meaningful.</em>
                </>,
              ]}
            />
            <p className="max-w-sm text-lead text-mist">
              Buying a home, visiting a site or bringing land to the table: tell us what you have in
              mind.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-6 text-small">
            {contact.email || contact.phone ? (
              <>
                {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                {contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
              </>
            ) : (
              <p className="text-mist">Office phone and email will be published shortly.</p>
            )}
            <PhotoCredit image={image} className="text-mist" />
          </div>
        </div>

        <div className="col-span-full border border-line bg-obsidian/95 p-6 sm:p-10 lg:col-span-6 lg:col-start-7">
          <EnquiryForm />
        </div>
      </Container>
    </Section>
  );
}
