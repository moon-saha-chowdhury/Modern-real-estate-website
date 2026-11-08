import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.expertise;

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
