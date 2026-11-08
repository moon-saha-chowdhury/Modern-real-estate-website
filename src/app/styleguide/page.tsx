import type { Metadata } from "next";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section, type SectionTone } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";

/** Internal design-system reference. Not linked from navigation and excluded from indexing. */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colours = [
  { name: "Obsidian", token: "obsidian", hex: "#101713", role: "Primary dark", text: "ivory" },
  { name: "Forest", token: "forest", hex: "#1E3027", role: "Deep forest", text: "ivory" },
  { name: "Charcoal", token: "charcoal", hex: "#141914", role: "Secondary dark", text: "ivory" },
  { name: "Sage", token: "sage", hex: "#647C62", role: "Muted accent · large type", text: "ivory" },
  { name: "Brand", token: "brand", hex: "#337418", role: "Deliberate accent", text: "ivory" },
  {
    name: "Champagne",
    token: "champagne",
    hex: "#C2B99F",
    role: "Editorial highlight",
    text: "obsidian",
  },
  { name: "Ivory", token: "ivory", hex: "#F1EFE7", role: "Light surface · text", text: "obsidian" },
  { name: "Mist", token: "mist", hex: "#A5AAA1", role: "Secondary text", text: "obsidian" },
  { name: "Line", token: "line", hex: "#303A32", role: "Borders", text: "ivory" },
] as const;

const swatchBg: Record<string, string> = {
  obsidian: "bg-obsidian",
  forest: "bg-forest",
  charcoal: "bg-charcoal",
  sage: "bg-sage",
  brand: "bg-brand",
  champagne: "bg-champagne",
  ivory: "bg-ivory",
  mist: "bg-mist",
  line: "bg-line",
};

const typeScale = [
  { label: "Display XL", className: "text-display-xl", sample: "Shaping tomorrow" },
  { label: "Display LG", className: "text-display-lg", sample: "Selected developments" },
  { label: "Display MD", className: "text-display-md", sample: "From land to landmark" },
  { label: "Display SM", className: "text-display-sm", sample: "Engineering excellence" },
];

const tones: SectionTone[] = ["obsidian", "forest", "charcoal", "ivory"];

export default function StyleguidePage() {
  return (
    <>
      <Section
        tone="obsidian"
        spacing="none"
        className="pt-[calc(var(--spacing-nav)+6rem)] pb-section"
      >
        <Container>
          <SectionHeading
            as="h1"
            size="lg"
            eyebrow="Midnight Forest — Design system"
            index="00"
            title={[
              "Architectural",
              <>
                <em className="text-champagne">luxury</em>, quietly.
              </>,
            ]}
            intro={
              <p>
                Tokens, typography and components for Meridian Developments. Internal reference.
              </p>
            }
          />
        </Container>
      </Section>

      {/* Colour */}
      <Section tone="charcoal" spacing="compact">
        <Container className="flex flex-col gap-12">
          <Eyebrow index="01" className="text-champagne">
            Colour
          </Eyebrow>
          <ul className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-9">
            {colours.map((c) => (
              <li key={c.token} className="flex flex-col bg-charcoal">
                <div className={`${swatchBg[c.token]} aspect-[3/4] lg:aspect-[1/2]`} />
                <div className="flex flex-col gap-1 p-4">
                  <span className="text-small text-ivory">{c.name}</span>
                  <span className="label-mono text-mist">{c.hex}</span>
                  <span className="text-[0.75rem] text-mist">{c.role}</span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Typography */}
      <Section tone="obsidian" spacing="compact">
        <Container className="flex flex-col gap-12">
          <Eyebrow index="02" className="text-champagne">
            Typography
          </Eyebrow>
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {typeScale.map((t) => (
              <div key={t.label} className="grid-editorial items-baseline gap-y-3 py-8">
                <span className="col-span-full label-mono text-mist lg:col-span-2">{t.label}</span>
                <p className={`col-span-full font-display lg:col-span-10 ${t.className}`}>
                  {t.sample.split(" ").slice(0, -1).join(" ")}{" "}
                  <em className="text-champagne">{t.sample.split(" ").slice(-1)}</em>
                </p>
              </div>
            ))}
            <div className="grid-editorial gap-y-3 py-8">
              <span className="col-span-full label-mono text-mist lg:col-span-2">
                Lead · Manrope
              </span>
              <p className="col-span-full max-w-2xl text-lead lg:col-span-8">
                We believe every building begins with a promise — of thoughtful design, lasting
                quality, and spaces that become part of people&apos;s lives.
              </p>
            </div>
            <div className="grid-editorial gap-y-3 py-8">
              <span className="col-span-full label-mono text-mist lg:col-span-2">
                Body · Manrope
              </span>
              <p className="col-span-full max-w-prose text-mist lg:col-span-6">
                Body copy is set generously, with a long measure capped near 70 characters.
                Secondary text uses Mist on dark surfaces and a derived soft ink on Ivory.
              </p>
            </div>
            <div className="grid-editorial gap-y-3 py-8">
              <span className="col-span-full label-mono text-mist lg:col-span-2">
                Label · Plex Mono
              </span>
              <div className="col-span-full flex flex-wrap items-center gap-8 lg:col-span-10">
                <Eyebrow index="03">Section annotation</Eyebrow>
                <span className="label-mono text-champagne">Gulshan, Dhaka · Residential</span>
                <SampleBadge className="text-mist" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Buttons & surfaces */}
      <Section tone="obsidian" spacing="none" className="pb-section">
        <Container className="flex flex-col gap-12">
          <Eyebrow index="03" className="text-champagne">
            Surfaces &amp; actions
          </Eyebrow>
        </Container>
        <div className="mt-12 flex flex-col">
          {tones.map((tone) => {
            const surface = tone === "ivory" ? "light" : "dark";
            return (
              <Section key={tone} tone={tone} spacing="none" className="py-14">
                <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                  <span className="label-mono opacity-70">{tone}</span>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Button surface={surface} icon>
                      Explore Projects
                    </Button>
                    <Button surface={surface} variant="outline">
                      Schedule a Visit
                    </Button>
                    <Button surface={surface} variant="text">
                      Our Approach
                    </Button>
                  </div>
                </Container>
              </Section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
