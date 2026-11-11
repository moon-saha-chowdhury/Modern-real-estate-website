import { LegalPage } from "@/components/common/LegalPage";
import { privacySections } from "@/data/legal";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.privacy;

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={["Privacy", "*policy*."]}
      intro="How we look after the personal information you give us through this website."
      sections={privacySections}
    />
  );
}
