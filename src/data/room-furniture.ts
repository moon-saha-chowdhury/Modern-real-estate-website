import type { FurnitureItem } from "@/types/room3d";

/**
 * Furniture for the 3D room designer. ⚠ SAMPLE: these are free CC0 models from Poly Haven (no
 * attribution is required; the author is kept for the record), standing in for a real catalogue.
 * Each file is a GLB with meshopt-compressed geometry and 1k WebP textures (see
 * scripts or docs); it is fetched only when the visitor adds the item.
 *
 * The sofa, bed, dining set and lamp are CC-BY from Sketchfab: the credit line of each must be
 * shown wherever they are used (the designer lists them). Their raw files are not in the repo
 * (references/ is ignored); the GLBs here are compressed and the bed is simplified.
 * Still to do: a rug (a textured plane in code, no model needed).
 */
export const furniture: FurnitureItem[] = [
  {
    id: "mid_century_lounge_chair",
    name: "Mid-century lounge chair",
    category: "seating",
    file: "/media/room3d/models/mid_century_lounge_chair.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/mid_century_lounge_chair",
      author: "Kuutti Siitonen",
      license: "CC0",
    },
  },
  {
    id: "modern_arm_chair_01",
    name: "Armchair",
    category: "seating",
    file: "/media/room3d/models/modern_arm_chair_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/modern_arm_chair_01",
      author: "Vibrant Nordic",
      license: "CC0",
    },
  },
  {
    id: "dining_chair_02",
    name: "Dining chair",
    category: "seating",
    file: "/media/room3d/models/dining_chair_02.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/dining_chair_02",
      author: "James Ray Cock",
      license: "CC0",
    },
  },
  {
    id: "Ottoman_01",
    name: "Ottoman",
    category: "seating",
    file: "/media/room3d/models/Ottoman_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/Ottoman_01",
      author: "Caspian Fortune",
      license: "CC0",
    },
  },
  {
    id: "modern_coffee_table_01",
    name: "Stone coffee table",
    category: "tables",
    file: "/media/room3d/models/modern_coffee_table_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/modern_coffee_table_01",
      author: "Amin",
      license: "CC0",
    },
  },
  {
    id: "coffee_table_round_01",
    name: "Round marble coffee table",
    category: "tables",
    file: "/media/room3d/models/coffee_table_round_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/coffee_table_round_01",
      author: "Ulan Cabanilla",
      license: "CC0",
    },
  },
  {
    id: "side_table_01",
    name: "Side table",
    category: "tables",
    file: "/media/room3d/models/side_table_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/side_table_01",
      author: "James Ray Cock",
      license: "CC0",
    },
  },
  {
    id: "modern_wooden_cabinet",
    name: "Wooden cabinet",
    category: "storage",
    file: "/media/room3d/models/modern_wooden_cabinet.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/modern_wooden_cabinet",
      author: "Patrik Pangerl",
      license: "CC0",
    },
  },
  {
    id: "wooden_display_shelves_01",
    name: "Display shelves",
    category: "storage",
    file: "/media/room3d/models/wooden_display_shelves_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/wooden_display_shelves_01",
      author: "James Ray Cock",
      license: "CC0",
    },
  },
  {
    id: "steel_frame_shelves_03",
    name: "Steel-frame shelving",
    category: "storage",
    file: "/media/room3d/models/steel_frame_shelves_03.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/steel_frame_shelves_03",
      author: "Ulan Cabanilla",
      license: "CC0",
    },
  },
  {
    id: "calathea_orbifolia_01",
    name: "Calathea",
    category: "decor",
    file: "/media/room3d/models/calathea_orbifolia_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/calathea_orbifolia_01",
      author: "Rob Tuytel, Rico Cilliers",
      license: "CC0",
    },
  },
  {
    id: "pachira_aquatica_01",
    name: "Money tree",
    category: "decor",
    file: "/media/room3d/models/pachira_aquatica_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/pachira_aquatica_01",
      author: "Rob Tuytel, Rico Cilliers",
      license: "CC0",
    },
  },
  {
    id: "ceramic_vase_02",
    name: "Ceramic vase",
    category: "decor",
    file: "/media/room3d/models/ceramic_vase_02.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/ceramic_vase_02",
      author: "James Ray Cock",
      license: "CC0",
    },
  },
  {
    id: "hanging_picture_frame_01",
    name: "Picture frame",
    category: "decor",
    file: "/media/room3d/models/hanging_picture_frame_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/hanging_picture_frame_01",
      author: "James Ray Cock",
      license: "CC0",
    },
  },
  {
    id: "modern_ceiling_lamp_01",
    name: "Ceiling lamp",
    category: "lighting",
    file: "/media/room3d/models/modern_ceiling_lamp_01.glb",
    source: {
      name: "Poly Haven",
      url: "https://polyhaven.com/a/modern_ceiling_lamp_01",
      author: "James Ray Cock",
      license: "CC0",
    },
  },
  {
    id: "sofa_modern",
    name: "Modern sofa",
    category: "seating",
    file: "/media/room3d/models/sofa_modern.glb",
    source: {
      name: "Sketchfab",
      url: "https://sketchfab.com/3d-models/modern-sofa-ac92f6e97eaa43c4ad6cb8f7c65ac43f",
      author: "3dimentionalben",
      license: "CC-BY",
      credit:
        'This work is based on "Modern  Sofa" (https://sketchfab.com/3d-models/modern-sofa-ac92f6e97eaa43c4ad6cb8f7c65ac43f) by 3dimentionalben (https://sketchfab.com/3dimentionalben) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)',
    },
  },
  {
    id: "bed_01",
    name: "Bed",
    category: "beds",
    file: "/media/room3d/models/bed_01.glb",
    scale: 0.245,
    source: {
      name: "Sketchfab",
      url: "https://sketchfab.com/3d-models/bed-01-d4f3bf907138447cbdcee83f838228d5",
      author: "5th Dimension",
      license: "CC-BY",
      credit:
        'This work is based on "Bed 01" (https://sketchfab.com/3d-models/bed-01-d4f3bf907138447cbdcee83f838228d5) by 5th Dimension (https://sketchfab.com/5th-Dimension) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)',
    },
  },
  {
    id: "dining_set",
    name: "Dining set",
    category: "tables",
    file: "/media/room3d/models/dining_set.glb",
    scale: 0.0016,
    source: {
      name: "Sketchfab",
      url: "https://sketchfab.com/3d-models/modern-dining-room-table-set-fc73e8d591ba45f8a3b369596593dcf5",
      author: "Akshat",
      license: "CC-BY",
      credit:
        'This work is based on "Modern Dining Room Table Set" (https://sketchfab.com/3d-models/modern-dining-room-table-set-fc73e8d591ba45f8a3b369596593dcf5) by Akshat (https://sketchfab.com/shooter24994) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)',
    },
  },
  {
    id: "lamp_side",
    name: "Table lamp with stand",
    category: "lighting",
    file: "/media/room3d/models/lamp_side.glb",
    scale: 0.425,
    source: {
      name: "Sketchfab",
      url: "https://sketchfab.com/3d-models/modern-side-lamp-and-stand-880c46c5ddf44be58bb7cce0d682e988",
      author: "3dimentionalben",
      license: "CC-BY",
      credit:
        'This work is based on "modern side lamp and stand" (https://sketchfab.com/3d-models/modern-side-lamp-and-stand-880c46c5ddf44be58bb7cce0d682e988) by 3dimentionalben (https://sketchfab.com/3dimentionalben) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)',
    },
  },
];
