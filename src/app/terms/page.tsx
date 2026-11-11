import { LegalPage } from "@/components/common/LegalPage";
import { termsSections } from "@/data/legal";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.terms;

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={["Terms of", "*use*."]}
      intro="The ground rules for using this website."
      sections={termsSections}
    />
  );
}
