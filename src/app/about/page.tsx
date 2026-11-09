import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.about;

export default function Page() {
  return (
    <PageIntro
      eyebrow="About Meridian"
      index="01"
      title={["A practice built on", "*intention*."]}
      intro={<p>Our story, vision and the people behind every Meridian building.</p>}
    >
      <SampleBadge className="text-mist" label="In development — Milestone 7" />
    </PageIntro>
  );
}
