import { Button } from "@/components/common/Button";
import { PageIntro } from "@/components/common/PageIntro";

export default function NotFound() {
  return (
    <PageIntro
      eyebrow="Error 404"
      title={["This page is", "*not on the plan*."]}
      intro={<p>The page you’re looking for has moved or never existed.</p>}
    >
      <Button href="/" icon>
        Return home
      </Button>
    </PageIntro>
  );
}
