import type { PanoramaCheck, PanoramaMeta, PanoramaRules } from "@/types/tour";

/**
 * Checks a panorama's file facts against the rules. Pure (no image library), so it can run in
 * the browser of an admin screen as well as on the server. Messages are written for the person
 * uploading, not for developers.
 */
export function validatePanorama(meta: PanoramaMeta, rules: PanoramaRules): PanoramaCheck {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rules.formats.includes(meta.format)) {
    errors.push(`Use a JPEG, PNG, WebP or TIFF image (this one is ${meta.format}).`);
  }

  const ratio = meta.width / meta.height;
  if (Math.abs(ratio - 2) > 2 * rules.ratioTolerance) {
    errors.push(
      `A 360° panorama must be twice as wide as it is tall (2:1). This image is ${meta.width}×${meta.height}. An ordinary photo cannot be turned into a 360° view.`,
    );
  }

  if (meta.width < rules.minWidth) {
    errors.push(
      `Too small: the panorama must be at least ${rules.minWidth}px wide (${rules.recommendedWidth}px is best).`,
    );
  } else if (meta.width < rules.recommendedWidth / 2) {
    warnings.push(
      `Only ${meta.width}px wide: it will look soft when visitors zoom in. ${rules.recommendedWidth}px wide is best.`,
    );
  }
  if (meta.width > rules.maxWidth) {
    errors.push(`Too large: the panorama must be at most ${rules.maxWidth}px wide.`);
  }

  if (meta.bytes > rules.maxBytes) {
    const mb = Math.round(rules.maxBytes / 1024 / 1024);
    errors.push(`The file is too big (limit ${mb} MB). Export it as JPEG at high quality.`);
  }

  return { ok: errors.length === 0, errors, warnings };
}
