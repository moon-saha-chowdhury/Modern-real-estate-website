import Link from "next/link";
import { cacheLife } from "next/cache";
import { Container } from "@/components/common/Container";
import { SampleBadge } from "@/components/common/SampleBadge";
import { company } from "@/data/company";
import { legalNav, mainNav, portfolioNav } from "@/lib/constants/site";
import { FOOTER_LINK_CLASS as linkClass } from "@/lib/constants/ui";
import type { FooterColumnProps } from "@/types/ui";

/** Cached so `new Date()` stays out of the prerendered shell (Cache Components). */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="label-mono text-accent">{title}</h2>
      {children}
    </div>
  );
}

export function Footer() {
  const { contact, social } = company;
  const hasContact = Boolean(contact.phone || contact.email || contact.address);

  return (
    <footer
      data-surface="light"
      className="relative overflow-hidden border-t border-rule bg-surface text-fg"
    >
      <Container grid className="gap-y-14 pt-24 pb-16 md:pt-32">
        {/* Brand */}
        <div className="col-span-full flex flex-col gap-6 md:col-span-8 lg:col-span-5">
          <p className="max-w-[16ch] font-display text-display-sm">
            Spaces built with <em className="text-accent">intention</em>, made to endure.
          </p>
          <p className="max-w-prose text-small text-fg-muted">{company.description}</p>
          {company.isPlaceholder && (
            <SampleBadge className="self-start text-fg-muted" label="Draft brand copy" />
          )}
        </div>

        <nav aria-label="Footer" className="col-span-2 lg:col-span-2 lg:col-start-7">
          <FooterColumn title="Navigate">
            <ul className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </nav>

        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Portfolio">
            <ul className="flex flex-col gap-1">
              {portfolioNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        <div className="col-span-full md:col-span-4 lg:col-span-2">
          <FooterColumn title="Contact">
            {hasContact ? (
              <address className="flex flex-col gap-3 text-small text-fg/70 not-italic">
                {contact.address?.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                {contact.phone && (
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={linkClass}>
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className={linkClass}>
                    {contact.email}
                  </a>
                )}
                {contact.officeHours && (
                  <span className="text-fg-muted">{contact.officeHours}</span>
                )}
              </address>
            ) : (
              <p className="text-small text-fg-muted">
                Office details will be published shortly.{" "}
                <Link
                  href="/contact"
                  className="text-fg underline decoration-fg/30 underline-offset-4 hover:decoration-fg"
                >
                  Send an enquiry
                </Link>
              </p>
            )}
            {social.length > 0 && (
              <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
                {social.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer" className={linkClass}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </FooterColumn>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the page edge */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        <Container>
          {/* Drawn via a pseudo-element: purely decorative, so it is not exposed as text */}
          <p
            data-wordmark="Meridian"
            className="translate-y-[0.22em] font-display text-[clamp(5.5rem,25vw,23rem)] leading-[0.8] tracking-[-0.03em] text-fg/6 before:content-[attr(data-wordmark)]"
          />
        </Container>
      </div>

      <div className="relative border-t border-rule bg-surface">
        <Container className="flex flex-col gap-4 py-6 text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono">
            © <CurrentYear /> {company.name}
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1.5 label-mono transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
