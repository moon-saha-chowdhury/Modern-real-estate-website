import type { Metadata } from "next";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";

export const metadata: Metadata = {
  title: "About",
  description: "The vision, values and people behind Meridian Developments.",
};

export default function Page() {
  return (
    <PageIntro
      eyebrow="About Meridian"
      index="01"
      title={[
        "A practice built on",
        <>
          <em className="text-champagne">intention</em>.
        </>,
      ]}
      intro={<p>Our story, vision and the people behind every Meridian building.</p>}
    >
      <SampleBadge className="text-mist" label="In development — Milestone 7" />
    </PageIntro>
  );
}
