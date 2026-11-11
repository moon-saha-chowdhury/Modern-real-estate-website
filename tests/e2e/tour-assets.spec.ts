import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { projects } from "../../src/data/projects";
import { PANORAMA_RULES } from "../../src/lib/constants/tour";
import {
  fixSeam,
  inspectPanorama,
  measureSeam,
  preparePanorama,
  renderFlatView,
} from "../../src/lib/tour/prepare-panorama";
import { validatePanorama } from "../../src/lib/tour/validate-panorama";
import { validateTour } from "../../src/lib/validation/tour";

/** Pure logic for tour uploads: no browser, no server. */

const rules = PANORAMA_RULES;
const small = {
  ...rules,
  minWidth: 256,
  recommendedWidth: 512,
  outputs: [
    { suffix: "", width: 512 },
    { suffix: "-2k", width: 256 },
  ],
};

/**
 * A 1024x512 test panorama: a ramp from dark (left edge) to light (right edge) with a little
 * deterministic grain, so neighbouring columns differ the way they do in a photograph.
 */
function rampRaw(width = 1024) {
  const height = width / 2;
  const data = Buffer.alloc(width * height * 3);
  let seed = 12345;
  const grain = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return (seed / 4294967296 - 0.5) * 24;
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = 40 + (160 * x) / (width - 1) + grain();
      for (let c = 0; c < 3; c++) data[(y * width + x) * 3 + c] = Math.max(0, Math.min(255, v));
    }
  }
  return { data, width, height };
}

const toPng = (raw: ReturnType<typeof rampRaw>) =>
  sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 3 } })
    .png()
    .toBuffer();

test.describe("panorama file checks", () => {
  test("a 2:1 JPEG of a good size passes", () => {
    const check = validatePanorama(
      { width: 8192, height: 4096, bytes: 9_000_000, format: "jpeg" },
      rules,
    );
    expect(check).toEqual({ ok: true, errors: [], warnings: [] });
  });

  test("an ordinary photo is rejected with a plain explanation", () => {
    const check = validatePanorama(
      { width: 4000, height: 3000, bytes: 3_000_000, format: "jpeg" },
      rules,
    );
    expect(check.ok).toBe(false);
    expect(check.errors.join(" ")).toContain("2:1");
    expect(check.errors.join(" ")).toContain("ordinary photo");
  });

  test("too small, wrong format and too heavy are rejected; soft ones warn", () => {
    expect(
      validatePanorama({ width: 1000, height: 500, bytes: 1e6, format: "jpeg" }, rules).ok,
    ).toBe(false);
    expect(
      validatePanorama({ width: 4096, height: 2048, bytes: 1e6, format: "gif" }, rules).errors,
    ).toHaveLength(1);
    expect(
      validatePanorama(
        { width: 4096, height: 2048, bytes: 200 * 1024 * 1024, format: "png" },
        rules,
      ).ok,
    ).toBe(false);
    const soft = validatePanorama({ width: 3000, height: 1500, bytes: 1e6, format: "jpeg" }, rules);
    expect(soft.ok).toBe(true);
    expect(soft.warnings).toHaveLength(1);
  });
});

test.describe("seam", () => {
  test("a panorama whose edges differ has a high seam score; the fix removes it", () => {
    const raw = rampRaw();
    expect(measureSeam(raw)).toBeGreaterThan(rules.seamWarnAt);
    fixSeam(raw);
    expect(measureSeam(raw)).toBeLessThan(1.5);
  });

  test("inspect warns about the seam; prepare writes both sizes and fixes it", async () => {
    const png = await toPng(rampRaw());
    const inspection = await inspectPanorama(png, small);
    expect(inspection.ok).toBe(true);
    expect(inspection.warnings.join(" ")).toContain("edges");

    const outputs = await preparePanorama(png, small, { seam: true });
    expect(outputs.map((output) => output.width)).toEqual([512, 256]);
    expect(outputs.map((output) => output.height)).toEqual([256, 128]);
    const after = await inspectPanorama(outputs[0].buffer, small);
    expect(after.seamScore).toBeLessThan(1.5);
  });

  test("prepare refuses a file that breaks the rules", async () => {
    const flat = await sharp({
      create: { width: 600, height: 400, channels: 3, background: "#888" },
    })
      .png()
      .toBuffer();
    await expect(preparePanorama(flat, small)).rejects.toThrow(/2:1/);
  });
});

test.describe("flat views", () => {
  /** Black panorama with a bright vertical stripe at yaw +90 (three quarters across). */
  async function stripePanorama() {
    const width = 1024;
    const height = 512;
    const data = Buffer.alloc(width * height * 3);
    const centre = Math.round(width * 0.75);
    for (let y = 0; y < height; y++) {
      for (let x = centre - 12; x <= centre + 12; x++) {
        for (let c = 0; c < 3; c++) data[(y * width + x) * 3 + c] = 255;
      }
    }
    return sharp(data, { raw: { width, height, channels: 3 } })
      .png()
      .toBuffer();
  }

  /** x of the bright stripe in a rendered view, as the centre of mass of its column brightness. */
  async function stripeCentre(buffer: Buffer) {
    const { data, info } = await sharp(buffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const columns = new Float64Array(info.width);
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) columns[x] += data[y * info.width + x];
    }
    const floor = Math.max(...columns) * 0.5;
    let weight = 0;
    let moment = 0;
    columns.forEach((value, x) => {
      if (value > floor) {
        weight += value;
        moment += value * x;
      }
    });
    return moment / weight;
  }

  test("yaw matches the viewer: looking straight at +90 centres the stripe", async () => {
    const input = await stripePanorama();
    const view = { pitch: 0, hFov: 90, width: 400, height: 225 };
    const centred = await stripeCentre(await renderFlatView(input, { ...view, yaw: 90 }));
    expect(Math.abs(centred - 200)).toBeLessThan(12);
  });

  test("a camera turned to +60 sees the +90 stripe to its right", async () => {
    const input = await stripePanorama();
    const x = await stripeCentre(
      await renderFlatView(input, { yaw: 60, pitch: 0, hFov: 90, width: 400, height: 225 }),
    );
    // 30° right of the axis with a 90° field of view: 200 + 200 * tan(30°) ≈ 315.
    expect(x).toBeGreaterThan(295);
    expect(x).toBeLessThan(335);
  });
});

test.describe("tour data contract", () => {
  const tourOf = (slug: string) => {
    const project = projects.find((p) => p.slug === slug);
    if (project?.virtualTour?.kind !== "panorama") throw new Error("no panorama tour");
    return project.virtualTour;
  };

  test("the sample project's tour satisfies the contract", () => {
    const result = validateTour(tourOf("sample-the-linden"));
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  test("it reports what is wrong, in plain words, with where", () => {
    const good = structuredClone(tourOf("sample-the-linden"));
    const bad = structuredClone(good);
    bad.scenes[1].id = bad.scenes[0].id; // duplicate id
    bad.scenes[2].hotspots = [{ toSceneId: "attic", label: "Attic", yaw: 200, pitch: 0 }];
    delete (bad.scenes[3] as { mapPoint?: unknown }).mapPoint;
    const { ok, issues } = validateTour(bad);
    expect(ok).toBe(false);
    const text = issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n");
    expect(text).toContain("share the id");
    expect(text).toContain("does not exist");
    expect(text).toContain("between -180 and 180");
    expect(text).toContain("floor plan");
  });

  test("a tour needs at least one room and a self-link is refused", () => {
    const base = structuredClone(tourOf("sample-the-linden"));
    expect(validateTour({ ...base, scenes: [] }).ok).toBe(false);
    const loop = structuredClone(base);
    loop.scenes[0].hotspots = [{ toSceneId: loop.scenes[0].id, label: "Here", yaw: 0, pitch: 0 }];
    expect(
      validateTour(loop)
        .issues.map((i) => i.message)
        .join(" "),
    ).toContain("same room");
  });
});
