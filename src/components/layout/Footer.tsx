import Link from "next/link";
import type { ReactNode } from "react";
import { cacheLife } from "next/cache";
import { Container } from "@/components/common/Container";
import { SampleBadge } from "@/components/common/SampleBadge";
import { company } from "@/data/company";
import { legalNav, mainNav } from "@/lib/constants/site";

const portfolioLinks = [
  { label: "Residential", href: "/projects?category=residential" },
  { label: "Commercial", href: "/projects?category=commercial" },
  { label: "Upcoming", href: "/projects?status=upcoming" },
  { label: "Ongoing", href: "/projects?status=ongoing" },
  { label: "Completed", href: "/projects?status=completed" },
];

/** Cached so `new Date()` stays out of the prerendered shell (Cache Components). */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="label-mono text-champagne">{title}</h2>
      {children}
    </div>
  );
}

const linkClass =
  "text-small text-ivory/70 transition-colors duration-300 hover:text-ivory focus-visible:text-ivory";

export function Footer() {
  const { contact, social } = company;
  const hasContact = Boolean(contact.phone || contact.email || contact.address);

  return (
    <footer
      data-surface="dark"
      className="relative overflow-hidden border-t border-line bg-charcoal text-ivory"
    >
      <Container grid className="gap-y-14 pt-24 pb-16 md:pt-32">
        {/* Brand */}
        <div className="col-span-full flex flex-col gap-6 md:col-span-8 lg:col-span-5">
          <p className="max-w-[16ch] font-display text-display-sm">
            Spaces built with <em className="text-champagne">intention</em>, made to endure.
          </p>
          <p className="max-w-prose text-small text-mist">{company.description}</p>
          {company.isPlaceholder && (
            <SampleBadge className="self-start text-mist" label="Draft brand copy" />
          )}
        </div>

        <nav aria-label="Footer" className="col-span-2 lg:col-span-2 lg:col-start-7">
          <FooterColumn title="Navigate">
            <ul className="flex flex-col gap-3">
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
            <ul className="flex flex-col gap-3">
              {portfolioLinks.map((item) => (
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
              <address className="flex flex-col gap-3 text-small text-ivory/70 not-italic">
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
              </address>
            ) : (
              <p className="text-small text-mist">
                Office details will be published shortly.{" "}
                <Link
                  href="/contact"
                  className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
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
          <p className="translate-y-[0.22em] font-display text-[clamp(5.5rem,25vw,23rem)] leading-[0.8] tracking-[-0.03em] text-ivory/[0.06]">
            Meridian
          </p>
        </Container>
      </div>

      <div className="relative border-t border-line bg-charcoal">
        <Container className="flex flex-col gap-4 py-6 text-mist sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono">
            © <CurrentYear /> {company.name}
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label-mono transition-colors hover:text-ivory">
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
