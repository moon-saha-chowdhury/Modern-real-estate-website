import { Container } from "@/components/common/Container";
import { PageIntro } from "@/components/common/PageIntro";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { company } from "@/data/company";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.contact;

export default function Page() {
  const { contact } = company;
  const details: [string, React.ReactNode][] = [];
  if (contact.address) {
    details.push([
      "Visit",
      <address key="a" className="not-italic">
        {contact.address.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>,
    ]);
  }
  if (contact.phone) {
    details.push([
      "Call",
      <a key="p" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
        {contact.phone}
      </a>,
    ]);
  }
  if (contact.email) {
    details.push([
      "Write",
      <a key="e" href={`mailto:${contact.email}`}>
        {contact.email}
      </a>,
    ]);
  }
  if (contact.officeHours) details.push(["Hours", contact.officeHours]);

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        index="04"
        title={["Let’s build something", "*meaningful*."]}
        intro={<p>Project enquiries, site visits and landowner partnerships.</p>}
      />
      <Section tone="white" spacing="compact" aria-label="Enquiry">
        <Container grid className="gap-y-14">
          <div className="col-span-full flex flex-col gap-8 lg:col-span-4">
            {company.isPlaceholder && (
              <SampleBadge label="Sample contact details" className="self-start text-fg-muted" />
            )}
            <dl className="border-t border-rule">
              {details.map(([label, value]) => (
                <Reveal
                  key={label}
                  className="grid grid-cols-[5rem_1fr] gap-4 border-b border-rule py-5"
                >
                  <dt className="label-mono text-fg-muted">{label}</dt>
                  <dd className="text-fg">{value}</dd>
                </Reveal>
              ))}
            </dl>
            <p className="max-w-sm text-small text-fg-muted">
              Site visits are by appointment. Tell us which project you would like to see and we
              will arrange a time.
            </p>
          </div>
          <div className="col-span-full border border-rule bg-paper p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
            <EnquiryForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
