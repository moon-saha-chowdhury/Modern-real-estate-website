import type { Metadata } from "next";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms of use for Meridian Developments.",
};

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
