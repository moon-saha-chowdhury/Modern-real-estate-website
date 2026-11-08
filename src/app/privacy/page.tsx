import type { Metadata } from "next";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Privacy policy for Meridian Developments.",
};

export default function Page() {
  return (
    <PageIntro
      eyebrow="Legal"
      title={["Privacy policy"]}
      intro={<p>The privacy policy will be published once supplied by Meridian Developments.</p>}
    >
      <SampleBadge className="text-mist" label="In development — awaiting legal copy" />
    </PageIntro>
  );
}
