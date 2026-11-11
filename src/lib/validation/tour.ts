import { z } from "zod";

/**
 * The data an admin screen collects for a project's 360° tour, and the rules it must pass before
 * it is saved. The shape is the same as `VirtualTour` (kind "panorama") in src/types/project.ts,
 * so a record that passes here renders as it is.
 */

const ROOM_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const angle = (min: number, max: number, what: string) =>
  z
    .number({ error: `${what} must be a number.` })
    .min(min, `${what} must be between ${min} and ${max}.`)
    .max(max, `${what} must be between ${min} and ${max}.`);

const mediaImageSchema = z.object({
  src: z.string().trim().min(1, "Upload an image."),
  alt: z.string().trim().min(3, "Describe the image in a few words (for screen readers)."),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  isSample: z.boolean().optional(),
  isIllustrative: z.boolean().optional(),
});

const hotspotSchema = z.object({
  toSceneId: z.string().regex(ROOM_ID, "Choose the room this link leads to."),
  label: z.string().trim().min(1, "Name the link.").max(40, "Keep link names under 40 characters."),
  yaw: angle(-180, 180, "Yaw"),
  pitch: angle(-90, 90, "Pitch"),
});

const sceneSchema = z.object({
  id: z
    .string()
    .regex(ROOM_ID, "Use lowercase letters, numbers and hyphens only (e.g. master-bedroom).")
    .max(40),
  label: z.string().trim().min(1, "Name the room.").max(40, "Keep room names under 40 characters."),
  src: z.string().trim().min(1, "Upload the room's 360° panorama."),
  srcMobile: z.string().trim().min(1).optional(),
  initialYaw: angle(-180, 180, "Starting direction").optional(),
  description: z.string().trim().max(200, "Keep descriptions under 200 characters.").optional(),
  mapPoint: z.object({ x: angle(0, 100, "Map X"), y: angle(0, 100, "Map Y") }).optional(),
  hotspots: z.array(hotspotSchema).max(8, "A room can link to at most 8 others.").optional(),
});

export const tourSchema = z
  .object({
    kind: z.literal("panorama"),
    scenes: z.array(sceneSchema).min(1, "Add at least one room.").max(20, "At most 20 rooms."),
    poster: mediaImageSchema,
    plan: mediaImageSchema.optional(),
    isIllustrative: z.boolean().optional(),
  })
  .superRefine((tour, context) => {
    const ids = new Set<string>();
    tour.scenes.forEach((scene, i) => {
      if (ids.has(scene.id)) {
        context.addIssue({
          code: "custom",
          path: ["scenes", i, "id"],
          message: `Two rooms share the id "${scene.id}". Each room needs its own.`,
        });
      }
      ids.add(scene.id);
    });
    tour.scenes.forEach((scene, i) => {
      scene.hotspots?.forEach((hotspot, j) => {
        if (!ids.has(hotspot.toSceneId)) {
          context.addIssue({
            code: "custom",
            path: ["scenes", i, "hotspots", j, "toSceneId"],
            message: `"${hotspot.label}" leads to a room that does not exist.`,
          });
        } else if (hotspot.toSceneId === scene.id) {
          context.addIssue({
            code: "custom",
            path: ["scenes", i, "hotspots", j, "toSceneId"],
            message: `"${hotspot.label}" leads back to the same room.`,
          });
        }
      });
      if (tour.plan && !scene.mapPoint) {
        context.addIssue({
          code: "custom",
          path: ["scenes", i, "mapPoint"],
          message: `Mark where "${scene.label}" is on the floor plan, or remove the plan.`,
        });
      }
    });
  });

export type TourInput = z.input<typeof tourSchema>;
export type TourIssue = { path: string; message: string };

/** Validates a tour record and returns issues as readable "rooms.1.hotspots.0.toSceneId" paths. */
export function validateTour(tour: unknown): { ok: boolean; issues: TourIssue[] } {
  const result = tourSchema.safeParse(tour);
  if (result.success) return { ok: true, issues: [] };
  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}
