import { Container } from "@/components/common/Container";
import { CountUp } from "@/components/common/CountUp";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { metrics, metricsAreSample } from "@/data/metrics";

/**
 * 05 — Company statistics (paper). A statement on the left, a hairline-ruled schedule of four
 * figures on the right. The demo figures are invented and labelled "Sample figures"; a metric
 * with no value is a drafting-style blank ("—") labelled plainly.
 */
export function CompanyStats() {
  const pending = metrics.every((metric) => metric.value === null);

  return (
    <Section tone="paper" aria-labelledby="stats-title">
      <Container grid className="gap-y-14">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-5">
          <TextReveal
            as="h2"
            id="stats-title"
            className="font-display text-display-lg"
            lines={pending ? ["In *numbers,*", "once verified."] : ["In *numbers.*"]}
          />
          {metricsAreSample && !pending && (
            <SampleBadge label="Sample figures" className="self-start text-fg-muted" />
          )}
          {pending && (
            <Reveal>
              <p className="max-w-sm text-lead text-fg-muted">
                Figures appear here once Meridian has verified them. We don&apos;t publish
                estimates.
              </p>
            </Reveal>
          )}
        </div>

        {/* The hairlines are the cells' own borders: a drawing schedule rather than cards */}
        <dl className="col-span-full grid grid-cols-2 border-t border-rule lg:col-span-6 lg:col-start-7">
          {metrics.map((metric, i) => (
            <Reveal
              key={metric.id}
              delay={(i % 2) * 0.08}
              className="flex flex-col-reverse justify-end gap-5 border-b border-rule py-8 pr-4 even:border-l even:pl-6 lg:py-12 lg:pr-8 lg:even:pl-10"
            >
              <dt className="label-mono text-fg">{metric.label}</dt>
              <dd className="font-display text-display-lg text-accent tabular-nums">
                {metric.value === null ? (
                  <>
                    <span aria-hidden="true" className="block text-fg/25">
                      —
                    </span>
                    <span className="mt-2 block label-mono text-fg-muted">
                      Awaiting verified figure
                    </span>
                  </>
                ) : (
                  <CountUp to={metric.value} suffix={metric.suffix} />
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
