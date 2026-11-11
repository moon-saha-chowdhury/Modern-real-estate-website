import type { Project } from "@/types/project";
import { media } from "./media";

/**
 * ⚠ SAMPLE PROJECTS: clearly identified mock data (master prompt §16).
 * None of these are real Meridian developments. Names are placeholders, locations are
 * deliberately unconfirmed, and imagery is Unsplash stock. Every record is `isPlaceholder: true`
 * and the UI labels it "Sample project". Replace with real projects as they are supplied.
 */
export const projects: Project[] = [
  {
    id: "p-01",
    slug: "sample-the-linden",
    name: "The Linden",
    location: "Location TBC",
    category: "residential",
    status: "ongoing",
    summary: "Glass-fronted apartments arranged around deep, private balconies.",
    description:
      "A sample residential project used to demonstrate the portfolio layout. Real project details will replace this entry.",
    heroImage: media.projectGlassBalconies,
    gallery: [],
    amenities: [],
    floorPlans: [],
    // Pilot tour: AI-generated illustrative rooms (4096 px equirectangular, prepared with
    // scripts/prepare-panorama.mjs). Replace with real renders or photographs when available.
    virtualTour: {
      kind: "panorama",
      isIllustrative: true,
      poster: {
        src: "/media/tour/the-linden/poster.webp",
        width: 1600,
        height: 900,
        alt: "An open-plan living room at dusk with floor-to-ceiling windows over the water",
      },
      scenes: [
        {
          id: "living",
          label: "Living room",
          src: "/media/tour/the-linden/living.webp",
          srcMobile: "/media/tour/the-linden/living-2k.webp",
          initialYaw: -8,
          hotspots: [
            { toSceneId: "bedroom", label: "Bedroom", yaw: -2, pitch: 2 },
            { toSceneId: "dining", label: "Dining & terrace", yaw: 130, pitch: -16 },
            { toSceneId: "balcony", label: "Balcony", yaw: -85, pitch: -16 },
          ],
        },
        {
          id: "dining",
          label: "Dining & terrace",
          src: "/media/tour/the-linden/dining.webp",
          srcMobile: "/media/tour/the-linden/dining-2k.webp",
          initialYaw: 7,
          hotspots: [
            { toSceneId: "living", label: "Living room", yaw: -63, pitch: -16 },
            { toSceneId: "balcony", label: "Balcony", yaw: 16, pitch: -10 },
          ],
        },
        {
          id: "bedroom",
          label: "Bedroom",
          src: "/media/tour/the-linden/bedroom.webp",
          srcMobile: "/media/tour/the-linden/bedroom-2k.webp",
          initialYaw: -40,
          hotspots: [
            { toSceneId: "living", label: "Living room", yaw: -129, pitch: -5 },
            { toSceneId: "bathroom", label: "Bathroom", yaw: 133, pitch: -9 },
            { toSceneId: "balcony", label: "Balcony", yaw: 7, pitch: 0 },
          ],
        },
        {
          id: "balcony",
          label: "Balcony",
          src: "/media/tour/the-linden/balcony.webp",
          srcMobile: "/media/tour/the-linden/balcony-2k.webp",
          initialYaw: 0,
          hotspots: [{ toSceneId: "living", label: "Living room", yaw: -137, pitch: 0 }],
        },
        {
          id: "bathroom",
          label: "Bathroom",
          src: "/media/tour/the-linden/bathroom.webp",
          srcMobile: "/media/tour/the-linden/bathroom-2k.webp",
          initialYaw: -2,
          hotspots: [{ toSceneId: "bedroom", label: "Bedroom", yaw: 65, pitch: -11 }],
        },
      ],
    },
    featured: true,
    isPlaceholder: true,
  },
  {
    id: "p-02",
    slug: "sample-northlight-tower",
    name: "Northlight Tower",
    location: "Location TBC",
    category: "residential",
    status: "completed",
    summary: "A slender tower of stacked, light-filled homes.",
    description:
      "A sample residential project used to demonstrate the portfolio layout. Real project details will replace this entry.",
    heroImage: media.projectNightTower,
    gallery: [],
    amenities: [],
    floorPlans: [],
    virtualTour: null,
    featured: true,
    isPlaceholder: true,
  },
  {
    id: "p-03",
    slug: "sample-corner-house",
    name: "Corner House",
    location: "Location TBC",
    category: "residential",
    status: "upcoming",
    summary: "A precise concrete corner plot with a quiet, layered facade.",
    description:
      "A sample residential project used to demonstrate the portfolio layout. Real project details will replace this entry.",
    heroImage: media.projectConcreteEdge,
    gallery: [],
    amenities: [],
    floorPlans: [],
    virtualTour: null,
    featured: true,
    isPlaceholder: true,
  },
  {
    id: "p-04",
    slug: "sample-concrete-terraces",
    name: "Concrete Terraces",
    location: "Location TBC",
    category: "residential",
    status: "completed",
    summary: "Staggered balconies giving every home its own outdoor room.",
    description:
      "A sample residential project used to demonstrate the portfolio layout. Real project details will replace this entry.",
    heroImage: media.projectConcreteBalconies,
    gallery: [],
    amenities: [],
    floorPlans: [],
    virtualTour: null,
    featured: true,
    isPlaceholder: true,
  },
  {
    id: "p-05",
    slug: "sample-exchange-court",
    name: "Exchange Court",
    location: "Location TBC",
    category: "commercial",
    status: "ongoing",
    summary: "Workspace in glass and brick, with daylight on every floor plate.",
    description:
      "A sample commercial project used to demonstrate the portfolio layout. Real project details will replace this entry.",
    heroImage: media.projectOfficeSunset,
    gallery: [],
    amenities: [],
    floorPlans: [],
    virtualTour: null,
    featured: true,
    isPlaceholder: true,
  },
  {
    id: "p-06",
    slug: "sample-facet-commons",
    name: "Facet Commons",
    location: "Location TBC",
    category: "commercial",
    status: "upcoming",
    summary: "A faceted glass facade for a mixed-use commercial address.",
    description:
      "A sample commercial project used to demonstrate the portfolio layout. Real project details will replace this entry.",
    heroImage: media.projectGeometricFacade,
    gallery: [],
    amenities: [],
    floorPlans: [],
    virtualTour: null,
    featured: false,
    isPlaceholder: true,
  },
];
