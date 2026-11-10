import { Container } from "@/components/common/Container";
import { CountUp } from "@/components/common/CountUp";
import { Section } from "@/components/common/Section";
import { metrics } from "@/data/metrics";

/**
 * 05 — Company statistics (obsidian).
 * Shows only verified figures. Until Meridian supplies them, each metric shows a drafting-style
 * blank ("—") and the section says plainly why, rather than inventing numbers.
 */
export function CompanyStats() {
  const pending = metrics.every((metric) => metric.value === null);

  return (
    <Section tone="paper" spacing="compact" aria-labelledby="stats-title">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="stats-title" className="sr-only">
            In numbers
          </h2>
          {pending && (
            <p className="max-w-sm text-small text-fg-muted md:text-right">
              Figures appear here once they have been verified by Meridian. We don&apos;t publish
              estimates.
            </p>
          )}
        </div>

        {/* 1px gaps over the line colour draw the hairline grid */}
        <dl className="grid grid-cols-2 gap-px border-y border-rule bg-rule lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col-reverse justify-end gap-6 bg-surface py-10 pr-6 even:pl-6 lg:pl-8 lg:first:pl-0 lg:even:pl-8"
            >
              <dt className="label-mono text-fg">{metric.label}</dt>
              <dd className="font-display text-display-lg text-accent tabular-nums">
                {metric.value === null ? (
                  <span className="block pt-6 label-mono text-fg-muted lg:pt-8">
                    Awaiting verified figure
                  </span>
                ) : (
                  <CountUp to={metric.value} suffix={metric.suffix} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
