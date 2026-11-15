import * as THREE from "three";
import { DEFAULT_WALL, SHELL_COLORS, WALL_FINISHES } from "@/lib/constants/room3d";
import type { FloorKey, PlanOpening, PlanRoom, PlanWall, ResidencePlan } from "@/types/room3d";
import { FLOOR_ROUGHNESS, FLOOR_TILE, floorTexture } from "./floor-textures";

/** One wall, for the cutaway: lowered when it stands between the camera and the rooms. */
export interface ShellWall {
  holder: THREE.Group;
  /** The direction the street (or balcony) side faces; null for a wall between two rooms. */
  outward: THREE.Vector3 | null;
  /** The middle of the wall. */
  centre: THREE.Vector3;
}

/** The apartment's walls, floors and glass, built from a plan. */
export interface Shell {
  group: THREE.Group;
  walls: ShellWall[];
  setWallColor(roomId: string, color: string): void;
  setFloor(roomId: string, key: FloorKey): void;
  dispose(): void;
}

const SKIN_OFFSET = 0.003;
const FRAME = 0.045;
const SLAB = 0.28;

/**
 * The outline of a wall seen from the side, with its openings cut out. A doorway that reaches the
 * floor is a notch in the outline (a hole may not touch its edge); the rest are holes.
 */
function wallShape(length: number, height: number, openings: readonly PlanOpening[]): THREE.Shape {
  const notches = openings.filter((o) => o.sill <= 0.001).sort((a, b) => a.at - b.at);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  for (const o of notches) {
    const top = Math.min(o.height, height - 0.05);
    shape.lineTo(o.at, 0);
    shape.lineTo(o.at, top);
    shape.lineTo(o.at + o.width, top);
    shape.lineTo(o.at + o.width, 0);
  }
  shape.lineTo(length, 0);
  shape.lineTo(length, height);
  shape.lineTo(0, height);
  shape.closePath();
  for (const o of openings.filter((o) => o.sill > 0.001)) {
    const hole = new THREE.Path();
    const top = Math.min(o.sill + o.height, height - 0.05);
    hole.moveTo(o.at, o.sill);
    hole.lineTo(o.at, top);
    hole.lineTo(o.at + o.width, top);
    hole.lineTo(o.at + o.width, o.sill);
    hole.closePath();
    shape.holes.push(hole);
  }
  return shape;
}

export function buildShell(plan: ResidencePlan, anisotropy: number): Shell {
  const group = new THREE.Group();
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(thing: T): T => {
    disposables.push(thing);
    return thing;
  };

  const bodyMaterial = track(
    new THREE.MeshStandardMaterial({ color: SHELL_COLORS.wallBody, roughness: 0.92 }),
  );
  const outsideMaterial = track(
    new THREE.MeshStandardMaterial({ color: SHELL_COLORS.outside, roughness: 0.9 }),
  );
  const slabMaterial = track(
    new THREE.MeshStandardMaterial({ color: SHELL_COLORS.slab, roughness: 0.95 }),
  );
  const frameMaterial = track(
    new THREE.MeshStandardMaterial({ color: SHELL_COLORS.frame, roughness: 0.45, metalness: 0.6 }),
  );
  const glassMaterial = track(
    new THREE.MeshStandardMaterial({
      color: SHELL_COLORS.glass,
      roughness: 0.05,
      metalness: 0,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );

  const defaultWall =
    WALL_FINISHES.find((finish) => finish.key === DEFAULT_WALL) ?? WALL_FINISHES[0];
  const wallMaterials = new Map<string, THREE.MeshStandardMaterial>();
  for (const room of plan.rooms) {
    if (!room.styleable) continue;
    wallMaterials.set(
      room.id,
      track(new THREE.MeshStandardMaterial({ color: defaultWall.color, roughness: 0.88 })),
    );
  }
  const skinFor = (roomId: string) => wallMaterials.get(roomId) ?? outsideMaterial;

  /* ---------- Walls ---------- */
  const walls: ShellWall[] = [];
  for (const wall of plan.walls as readonly PlanWall[]) {
    const horizontal = wall.from[1] === wall.to[1];
    const length = horizontal
      ? Math.abs(wall.to[0] - wall.from[0])
      : Math.abs(wall.to[1] - wall.from[1]);
    const t = wall.thickness;
    const height = plan.wallHeight;
    const openings = (wall.openings ?? []).map((o) =>
      horizontal ? o : { ...o, at: length - o.at - o.width },
    );
    const shape = wallShape(length, height, openings);

    const holder = new THREE.Group();
    if (horizontal) {
      holder.position.set(Math.min(wall.from[0], wall.to[0]), 0, wall.from[1]);
    } else {
      holder.position.set(wall.from[0], 0, Math.max(wall.from[1], wall.to[1]));
      holder.rotation.y = Math.PI / 2;
    }

    const bodyGeometry = track(new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false }));
    bodyGeometry.translate(0, 0, -t / 2);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    holder.add(body);

    // Two skins, one per face, each painted with its own room's colour.
    const skinGeometry = track(new THREE.ShapeGeometry(shape));
    const skinB = new THREE.Mesh(skinGeometry, skinFor(wall.b));
    skinB.position.z = t / 2 + SKIN_OFFSET;
    skinB.receiveShadow = true;
    const skinA = new THREE.Mesh(skinGeometry, skinFor(wall.a));
    skinA.position.set(length, 0, -t / 2 - SKIN_OFFSET);
    skinA.rotation.y = Math.PI;
    skinA.receiveShadow = true;
    holder.add(skinA, skinB);

    // Windows: a pane of glass in a dark frame, with a mullion every 1.6 m or so.
    for (const o of openings.filter((o) => o.kind === "window")) {
      const cx = o.at + o.width / 2;
      const cy = o.sill + Math.min(o.height, height - 0.05) / 2;
      const h = Math.min(o.height, height - 0.05);
      const pane = new THREE.Mesh(track(new THREE.PlaneGeometry(o.width, h)), glassMaterial);
      pane.position.set(cx, cy, 0);
      pane.renderOrder = 2;
      holder.add(pane);
      const bar = (w: number, hh: number, x: number, y: number) => {
        const mesh = new THREE.Mesh(track(new THREE.BoxGeometry(w, hh, t * 0.7)), frameMaterial);
        mesh.position.set(x, y, 0);
        mesh.castShadow = true;
        holder.add(mesh);
      };
      bar(o.width, FRAME, cx, o.sill + FRAME / 2);
      bar(o.width, FRAME, cx, o.sill + h - FRAME / 2);
      bar(FRAME, h, o.at + FRAME / 2, cy);
      bar(FRAME, h, o.at + o.width - FRAME / 2, cy);
      const mullions = Math.ceil(o.width / 1.6) - 1;
      for (let m = 1; m <= mullions; m++)
        bar(FRAME * 0.8, h, o.at + (o.width / (mullions + 1)) * m, cy);
    }
    group.add(holder);
    const outward =
      wall.a === "outside"
        ? new THREE.Vector3(horizontal ? 0 : -1, 0, horizontal ? -1 : 0)
        : wall.b === "outside"
          ? new THREE.Vector3(horizontal ? 0 : 1, 0, horizontal ? 1 : 0)
          : null;
    walls.push({
      holder,
      outward,
      centre: new THREE.Vector3(
        (wall.from[0] + wall.to[0]) / 2,
        height / 2,
        (wall.from[1] + wall.to[1]) / 2,
      ),
    });
  }

  /* ---------- Floors ---------- */
  const floorMaterials = new Map<string, THREE.MeshStandardMaterial>();
  const makeFloor = (room: PlanRoom) => {
    const material = track(
      new THREE.MeshStandardMaterial({
        map: floorTexture(room.floor, anisotropy),
        roughness: FLOOR_ROUGHNESS[room.floor],
      }),
    );
    floorMaterials.set(room.id, material);
    const geometry = track(new THREE.PlaneGeometry(room.width, room.depth));
    geometry.rotateX(-Math.PI / 2);
    // Texture coordinates in metres, so every room's boards line up with the next room's.
    const position = geometry.getAttribute("position");
    const uv = geometry.getAttribute("uv");
    for (let i = 0; i < position.count; i++) {
      uv.setXY(
        i,
        (room.x + room.width / 2 + position.getX(i)) / FLOOR_TILE,
        (room.z + room.depth / 2 + position.getZ(i)) / FLOOR_TILE,
      );
    }
    const floor = new THREE.Mesh(geometry, material);
    floor.position.set(room.x + room.width / 2, 0.002, room.z + room.depth / 2);
    floor.receiveShadow = true;
    const slab = new THREE.Mesh(
      track(new THREE.BoxGeometry(room.width, SLAB, room.depth)),
      slabMaterial,
    );
    slab.position.set(room.x + room.width / 2, -SLAB / 2, room.z + room.depth / 2);
    slab.receiveShadow = true;
    slab.castShadow = true;
    group.add(slab, floor);
  };
  plan.rooms.forEach(makeFloor);

  /* ---------- The balcony's glass balustrade ---------- */
  for (const rail of plan.balustrades) {
    const alongX = rail.from[1] === rail.to[1];
    const length = alongX
      ? Math.abs(rail.to[0] - rail.from[0])
      : Math.abs(rail.to[1] - rail.from[1]);
    const cx = (rail.from[0] + rail.to[0]) / 2;
    const cz = (rail.from[1] + rail.to[1]) / 2;
    const pane = new THREE.Mesh(track(new THREE.PlaneGeometry(length, 1.0)), glassMaterial);
    pane.position.set(cx, 0.55, cz);
    pane.rotation.y = alongX ? 0 : Math.PI / 2;
    pane.renderOrder = 2;
    const top = new THREE.Mesh(
      track(new THREE.BoxGeometry(alongX ? length : 0.06, 0.05, alongX ? 0.06 : length)),
      frameMaterial,
    );
    top.position.set(cx, 1.07, cz);
    top.castShadow = true;
    group.add(pane, top);
  }

  return {
    group,
    walls,
    setWallColor(roomId, color) {
      wallMaterials.get(roomId)?.color.set(color);
    },
    setFloor(roomId, key) {
      const material = floorMaterials.get(roomId);
      if (!material) return;
      material.map = floorTexture(key, anisotropy);
      material.roughness = FLOOR_ROUGHNESS[key];
      material.needsUpdate = true;
    },
    dispose() {
      for (const item of disposables) item.dispose();
    },
  };
}
