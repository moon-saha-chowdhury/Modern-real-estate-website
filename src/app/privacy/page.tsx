import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.privacy;

export default function Page() {
  return (
    <PageIntro
      eyebrow="Legal"
      title={["Privacy policy"]}
      intro={<p>The privacy policy will be published once supplied by Meridian Developments.</p>}
    >
      <SampleBadge className="text-fg-muted" label="In development — awaiting legal copy" />
    </PageIntro>
  );
}
