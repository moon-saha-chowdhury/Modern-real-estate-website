import type { Metadata } from "next";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";

export const metadata: Metadata = {
  title: "Expertise",
  description:
    "Residential and commercial development, architecture, engineering, project management and landowner partnership.",
};

export default function Page() {
  return (
    <PageIntro
      eyebrow="Expertise"
      index="03"
      title={[
        "From land to",
        <>
          <em className="text-champagne">landmark</em>.
        </>,
      ]}
      intro={<p>Development, architecture, engineering and partnership — under one discipline.</p>}
    >
      <SampleBadge className="text-mist" label="In development — Milestone 7" />
    </PageIntro>
  );
}
