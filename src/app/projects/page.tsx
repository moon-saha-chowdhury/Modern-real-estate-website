import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.projects;

export default function Page() {
  return (
    <PageIntro
      eyebrow="Portfolio"
      index="02"
      title={["Selected", "*developments*."]}
      intro={<p>Residential and commercial buildings — upcoming, ongoing and completed.</p>}
    >
      <SampleBadge className="text-fg-muted" label="In development — Milestone 4" />
    </PageIntro>
  );
}
