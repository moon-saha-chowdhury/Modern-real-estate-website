import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.contact;

export default function Page() {
  return (
    <PageIntro
      eyebrow="Contact"
      index="04"
      title={["Let’s build something", "*meaningful*."]}
      intro={<p>Project enquiries, site visits and landowner partnerships.</p>}
    >
      <SampleBadge className="text-fg-muted" label="In development — Milestone 7" />
    </PageIntro>
  );
}
