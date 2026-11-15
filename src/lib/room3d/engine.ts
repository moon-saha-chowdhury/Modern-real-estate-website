import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { DESIGNER, SHELL_COLORS } from "@/lib/constants/room3d";
import type {
  DesignerView,
  FloorKey,
  FurnitureItem,
  PlacedFurniture,
  ResidencePlan,
} from "@/types/room3d";
import { buildShell, type Shell } from "./build-shell";

export interface DesignerEvents {
  /** The selected piece changed (null: nothing is selected). */
  onSelect(uid: string | null): void;
  /** A piece was dropped at a new place. */
  onMove(uid: string, x: number, z: number): void;
  /** How many models are still being fetched. */
  onLoading(pending: number): void;
}

/** One placed piece: the group that is moved and turned, and the half-size of its footprint. */
interface Entry {
  holder: THREE.Group;
  /** Half-size of the footprint when the piece is not turned (metres). */
  half: { x: number; z: number };
  placed: PlacedFurniture;
}

const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * The 3D room designer, without React: a three.js scene of the apartment's shell and furniture,
 * an orbit camera, and picking and dragging on the floor. React owns the design (what is placed,
 * which finishes) and tells the engine through `setPlaced`, `setWallColor` and `setFloor`; the
 * engine reports back what the visitor did through `DesignerEvents`.
 */
export class RoomDesigner {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly shell: Shell;
  private readonly loader = new GLTFLoader();
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly entries = new Map<string, Entry>();
  private readonly templates = new Map<string, Promise<THREE.Object3D>>();
  private readonly catalogue: Map<string, FurnitureItem>;
  private readonly outline: THREE.BoxHelper;
  private readonly observer: ResizeObserver;
  private readonly visibility: IntersectionObserver;
  /** Set whenever something changed that has to be drawn; the loop draws only then. */
  private dirty = true;
  private pending = 0;
  private visible = true;
  private disposed = false;
  private selected: string | null = null;
  private drag: { uid: string; offset: THREE.Vector3; moved: boolean } | null = null;
  private move: {
    from: { position: THREE.Vector3; target: THREE.Vector3 };
    to: { position: THREE.Vector3; target: THREE.Vector3 };
    start: number;
  } | null = null;
  private desired: readonly PlacedFurniture[] = [];

  constructor(
    private readonly container: HTMLElement,
    private readonly plan: ResidencePlan,
    catalogue: readonly FurnitureItem[],
    private readonly events: DesignerEvents,
  ) {
    this.catalogue = new Map(catalogue.map((item) => [item.id, item]));
    this.loader.setMeshoptDecoder(MeshoptDecoder);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    container.appendChild(canvas);

    this.scene.background = new THREE.Color(SHELL_COLORS.background);
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.32;
    pmrem.dispose();

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xcfc9b8, 0.55));
    const sun = new THREE.DirectionalLight(0xfff4e2, 1.7);
    sun.position.set(-7, 22, 3);
    sun.target.position.set(6.5, 0, 5.4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -14;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 60;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.025;
    this.scene.add(sun, sun.target);

    // A soft shadow on the ground under the plan, so the apartment sits on the page.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90).rotateX(-Math.PI / 2),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    ground.position.y = -0.29;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.shell = buildShell(plan, renderer.capabilities.getMaxAnisotropy());
    this.scene.add(this.shell.group);

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 160);
    const start = DESIGNER.views.dollhouse;
    this.camera.position.set(...start.position);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(...start.target);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = DESIGNER.minDistance;
    this.controls.maxDistance = DESIGNER.maxDistance;
    this.controls.maxPolarAngle = Math.PI / 2.02;
    this.controls.screenSpacePanning = false;
    // A drag on the camera cancels a camera move in progress.
    this.controls.addEventListener("start", () => (this.move = null));

    this.outline = new THREE.BoxHelper(new THREE.Object3D(), 0x337418);
    this.outline.visible = false;
    this.scene.add(this.outline);

    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerUp);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.visibility = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.invalidate();
    });
    this.visibility.observe(container);
    this.resize();

    renderer.setAnimationLoop(this.tick);
  }

  /** Ask for the next frame to be drawn. */
  private invalidate() {
    this.dirty = true;
  }

  /* ---------- The design, as told by React ---------- */

  setWallColor(roomId: string, color: string) {
    this.shell.setWallColor(roomId, color);
    this.invalidate();
  }

  setFloor(roomId: string, key: FloorKey) {
    this.shell.setFloor(roomId, key);
    this.invalidate();
  }

  /** Brings the scene in line with the list: adds what is new, removes what is gone, moves the rest. */
  setPlaced(list: readonly PlacedFurniture[]) {
    this.desired = list;
    const wanted = new Set(list.map((piece) => piece.uid));
    for (const [uid, entry] of this.entries) {
      if (!wanted.has(uid)) this.remove(uid, entry);
    }
    for (const piece of list) {
      const entry = this.entries.get(piece.uid);
      if (entry) {
        if (this.drag?.uid !== piece.uid) this.apply(entry, piece);
      } else {
        void this.add(piece);
      }
    }
  }

  select(uid: string | null) {
    this.invalidate();
    this.selected = uid;
    const entry = uid ? this.entries.get(uid) : undefined;
    if (entry) {
      this.outline.setFromObject(entry.holder);
      this.outline.visible = true;
    } else {
      this.outline.visible = false;
    }
  }

  setView(view: DesignerView) {
    const target = DESIGNER.views[view];
    this.flyTo(new THREE.Vector3(...target.position), new THREE.Vector3(...target.target));
  }

  /** Brings the camera over one room (or back to the whole plan when `roomId` is null). */
  focusRoom(roomId: string | null) {
    const room = this.plan.rooms.find((candidate) => candidate.id === roomId);
    if (!room) {
      this.setView("dollhouse");
      return;
    }
    const cx = room.x + room.width / 2;
    const cz = room.z + room.depth / 2;
    const reach = Math.max(room.width, room.depth);
    this.flyTo(
      new THREE.Vector3(
        cx + reach * 0.35,
        DESIGNER.focusHeight + reach * 0.25,
        cz + DESIGNER.focusBack + reach * 0.5,
      ),
      new THREE.Vector3(cx, 0, cz),
    );
  }

  /** The nearest legal place for a piece, once it has been turned or nudged. */
  fit(piece: PlacedFurniture): { x: number; z: number } {
    const entry = this.entries.get(piece.uid);
    if (!entry) return { x: piece.x, z: piece.z };
    const [x, z] = this.clamp({ ...entry, placed: piece }, piece.x, piece.z);
    return { x, z };
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.observer.disconnect();
    this.visibility.disconnect();
    this.controls.dispose();
    this.shell.dispose();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) material.dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    canvas.remove();
  }

  /* ---------- Furniture ---------- */

  /** A model is fetched once; every piece of that kind is a clone of it. */
  private template(item: FurnitureItem): Promise<THREE.Object3D> {
    let promise = this.templates.get(item.id);
    if (!promise) {
      promise = this.loader.loadAsync(item.file).then((gltf) => {
        const model = gltf.scene;
        model.scale.multiplyScalar(item.scale ?? 1);
        model.updateMatrixWorld(true);
        // Stand it on the floor, centred on its own footprint.
        const box = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        model.position.x -= centre.x;
        model.position.z -= centre.z;
        model.position.y -= box.min.y;
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        const wrapper = new THREE.Group();
        wrapper.add(model);
        wrapper.userData.half = {
          x: (box.max.x - box.min.x) / 2,
          z: (box.max.z - box.min.z) / 2,
        };
        return wrapper;
      });
      this.templates.set(item.id, promise);
    }
    return promise;
  }

  private async add(piece: PlacedFurniture) {
    const item = this.catalogue.get(piece.itemId);
    if (!item || this.entries.has(piece.uid)) return;
    this.setPending(1);
    try {
      const template = await this.template(item);
      // The piece may have been removed (or the engine disposed) while its model was loading.
      if (this.disposed || this.entries.has(piece.uid)) return;
      if (!this.desired.some((wanted) => wanted.uid === piece.uid)) return;
      const holder = new THREE.Group();
      const model = template.clone(true);
      model.position.y = item.elevation ?? 0;
      holder.add(model);
      holder.userData.uid = piece.uid;
      const entry: Entry = { holder, half: template.userData.half, placed: piece };
      this.entries.set(piece.uid, entry);
      this.scene.add(holder);
      const current = this.desired.find((wanted) => wanted.uid === piece.uid) ?? piece;
      this.apply(entry, current);
      if (this.selected === piece.uid) this.select(piece.uid);
    } finally {
      this.setPending(-1);
    }
  }

  private remove(uid: string, entry: Entry) {
    this.invalidate();
    this.scene.remove(entry.holder);
    this.entries.delete(uid);
    if (this.selected === uid) this.select(null);
  }

  private apply(entry: Entry, piece: PlacedFurniture) {
    this.invalidate();
    entry.placed = piece;
    entry.holder.position.set(piece.x, 0, piece.z);
    entry.holder.rotation.y = (piece.rotation % 4) * (Math.PI / 2);
    if (this.selected === piece.uid) this.outline.setFromObject(entry.holder);
  }

  private setPending(delta: number) {
    this.pending += delta;
    this.events.onLoading(this.pending);
  }

  /** Where the centre of a piece may go: inside the apartment, or inside the balcony. */
  private clamp(entry: Entry, x: number, z: number): [number, number] {
    const turned = entry.placed.rotation % 2 === 1;
    const hx = (turned ? entry.half.z : entry.half.x) + DESIGNER.edgeMargin;
    const hz = (turned ? entry.half.x : entry.half.z) + DESIGNER.edgeMargin;
    const balcony = this.plan.rooms.find((room) => room.id === "balcony");
    const apartmentDepth = balcony ? balcony.z : this.plan.bounds.depth;
    const inBalcony = balcony && z > apartmentDepth;
    const zone = inBalcony
      ? {
          x0: balcony.x,
          x1: balcony.x + balcony.width,
          z0: balcony.z,
          z1: balcony.z + balcony.depth,
        }
      : {
          x0: this.plan.bounds.x,
          x1: this.plan.bounds.x + this.plan.bounds.width,
          z0: 0,
          z1: apartmentDepth,
        };
    const snap = (value: number) => Math.round(value / DESIGNER.snap) * DESIGNER.snap;
    return [
      snap(Math.min(Math.max(x, zone.x0 + hx), zone.x1 - hx)),
      snap(Math.min(Math.max(z, zone.z0 + hz), zone.z1 - hz)),
    ];
  }

  /* ---------- Picking and dragging ---------- */

  private setPointer(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  private pick(): string | null {
    const holders = [...this.entries.values()].map((entry) => entry.holder);
    const hit = this.raycaster.intersectObjects(holders, true)[0];
    let object: THREE.Object3D | null = hit?.object ?? null;
    while (object && object.userData.uid === undefined) object = object.parent;
    return object ? (object.userData.uid as string) : null;
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.setPointer(event);
    const uid = this.pick();
    this.select(uid);
    this.events.onSelect(uid);
    if (!uid) return;
    const entry = this.entries.get(uid);
    const ground = new THREE.Vector3();
    if (!entry || !this.raycaster.ray.intersectPlane(this.floorPlane, ground)) return;
    this.drag = {
      uid,
      offset: entry.holder.position.clone().sub(ground),
      moved: false,
    };
    this.controls.enabled = false;
    this.renderer.domElement.setPointerCapture(event.pointerId);
    this.renderer.domElement.style.cursor = "grabbing";
  };

  private onPointerMove = (event: PointerEvent) => {
    this.setPointer(event);
    if (!this.drag) {
      this.renderer.domElement.style.cursor = this.pick() ? "grab" : "";
      return;
    }
    const entry = this.entries.get(this.drag.uid);
    const ground = new THREE.Vector3();
    if (!entry || !this.raycaster.ray.intersectPlane(this.floorPlane, ground)) return;
    const [x, z] = this.clamp(entry, ground.x + this.drag.offset.x, ground.z + this.drag.offset.z);
    if (x !== entry.holder.position.x || z !== entry.holder.position.z) this.drag.moved = true;
    entry.holder.position.set(x, 0, z);
    this.outline.setFromObject(entry.holder);
    this.invalidate();
  };

  private onPointerUp = (event: PointerEvent) => {
    if (!this.drag) return;
    const { uid, moved } = this.drag;
    const entry = this.entries.get(uid);
    this.drag = null;
    this.controls.enabled = true;
    this.renderer.domElement.style.cursor = "";
    if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
      this.renderer.domElement.releasePointerCapture(event.pointerId);
    }
    if (entry && moved) this.events.onMove(uid, entry.holder.position.x, entry.holder.position.z);
  };

  /* ---------- The camera and the loop ---------- */

  private flyTo(position: THREE.Vector3, target: THREE.Vector3) {
    this.move = {
      from: { position: this.camera.position.clone(), target: this.controls.target.clone() },
      to: { position, target },
      start: performance.now(),
    };
  }

  private resize() {
    const width = this.container.clientWidth || 1;
    const height = this.container.clientHeight || 1;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.invalidate();
  }

  /**
   * The cutaway: a wall between two rooms stands at partition height, and an outside wall that
   * faces the camera drops to a kerb, so the rooms can be seen into from wherever the camera is.
   */
  private cutaway(dt: number): boolean {
    const toCamera = new THREE.Vector3();
    const blend = 1 - Math.exp(-dt * 7);
    let moving = false;
    for (const wall of this.shell.walls) {
      let target = 1;
      if (!wall.outward) {
        target = DESIGNER.partitionHeight;
      } else if (toCamera.subVectors(this.camera.position, wall.centre).dot(wall.outward) > 0) {
        target = DESIGNER.kerbHeight;
      }
      const delta = target - wall.holder.scale.y;
      if (Math.abs(delta) > 0.002) {
        wall.holder.scale.y += delta * blend;
        moving = true;
      } else if (delta !== 0) {
        wall.holder.scale.y = target;
        moving = true;
      }
    }
    return moving;
  }

  private lastFrame = performance.now();

  private tick = () => {
    const now = performance.now();
    const dt = Math.min((now - this.lastFrame) / 1000, 0.1);
    this.lastFrame = now;
    if (!this.visible) return;
    let draw = this.dirty;
    this.dirty = false;
    if (this.move) {
      draw = true;
      const t = Math.min(
        1,
        (performance.now() - this.move.start) / (DESIGNER.cameraSeconds * 1000),
      );
      const e = ease(t);
      this.camera.position.lerpVectors(this.move.from.position, this.move.to.position, e);
      this.controls.target.lerpVectors(this.move.from.target, this.move.to.target, e);
      if (t >= 1) this.move = null;
    }
    if (this.controls.update()) draw = true;
    if (this.cutaway(dt)) draw = true;
    if (draw) this.renderer.render(this.scene, this.camera);
  };
}
