import type { Metadata } from "next";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";

export const metadata: Metadata = {
  title: "Projects",
  description: "Residential and commercial developments by Meridian Developments.",
};

export default function Page() {
  return (
    <PageIntro
      eyebrow="Portfolio"
      index="02"
      title={[
        "Selected",
        <>
          <em className="text-champagne">developments</em>.
        </>,
      ]}
      intro={<p>Residential and commercial buildings — upcoming, ongoing and completed.</p>}
    >
      <SampleBadge className="text-mist" label="In development — Milestone 4" />
    </PageIntro>
  );
}
