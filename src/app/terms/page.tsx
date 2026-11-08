import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.terms;

export default function Page() {
  return (
    <PageIntro
      eyebrow="Legal"
      title={["Terms of use"]}
      intro={<p>The terms of use will be published once supplied by Meridian Developments.</p>}
    >
      <SampleBadge className="text-mist" label="In development — awaiting legal copy" />
    </PageIntro>
  );
}
