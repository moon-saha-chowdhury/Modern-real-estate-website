import type { Metadata } from "next";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire about a Meridian project, schedule a visit or discuss a landowner partnership.",
};

export default function Page() {
  return (
    <PageIntro
      eyebrow="Contact"
      index="04"
      title={[
        "Let’s build something",
        <>
          <em className="text-champagne">meaningful</em>.
        </>,
      ]}
      intro={<p>Project enquiries, site visits and landowner partnerships.</p>}
    >
      <SampleBadge className="text-mist" label="In development — Milestone 7" />
    </PageIntro>
  );
}
