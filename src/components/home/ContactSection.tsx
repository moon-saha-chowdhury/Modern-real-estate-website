import { Container } from "@/components/common/Container";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { company } from "@/data/company";
import { media } from "@/data/media";

/**
 * 09 — Contact / partnership (stone).
 * Statement, contact details and a daylit interior on the left; the form rests on a white
 * panel on the right so it reads as the place to act.
 */
export function ContactSection() {
  const image = media.interiorLiving;
  const { contact } = company;

  return (
    <Section tone="stone" id="enquire" aria-labelledby="contact-title">
      <Container grid className="gap-y-16">
        <div className="col-span-full flex flex-col gap-10 lg:col-span-5">
          <TextReveal
            id="contact-title"
            className="font-display text-display-lg"
            lines={["Let's build", "something", "*meaningful.*"]}
          />
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

          <figure className="hidden flex-col gap-3 lg:flex">
            <ImageReveal
              src={image.src}
              alt={image.alt}
              sizes="(min-width: 1024px) 36vw, 0px"
              className="aspect-[4/3] w-full"
            />
            <PhotoCredit image={image} className="text-fg-muted" />
          </figure>
        </div>

        <div className="col-span-full self-start border border-rule bg-white p-6 sm:p-10 lg:col-span-6 lg:col-start-7">
          <EnquiryForm />
        </div>
      </Container>
    </Section>
  );
}
