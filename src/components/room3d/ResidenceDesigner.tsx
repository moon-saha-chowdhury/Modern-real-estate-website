"use client";

import {
  Box,
  Copy,
  Link2,
  LayoutTemplate,
  Redo2,
  RotateCcw,
  RotateCw,
  Trash2,
  Undo2,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { SampleBadge } from "@/components/common/SampleBadge";
import { furniture } from "@/data/room-furniture";
import { residencePlan as plan } from "@/data/residence-plan";
import {
  DEFAULT_WALL,
  DESIGNER,
  DESIGNER_TABS,
  DESIGNER_VIEWS,
  FLOOR_FINISHES,
  FURNITURE_CATEGORIES,
  MOODS,
  MOOD_EXEMPT_ROOMS,
  WALL_FINISHES,
} from "@/lib/constants/room3d";
import type { RoomDesigner } from "@/lib/room3d/engine";
import {
  decodeDesign,
  defaultDesign,
  encodeDesign,
  historyReducer,
  type Design,
  type History,
} from "@/lib/room3d/state";
import { cn } from "@/lib/utils/cn";
import type {
  DesignerTab,
  DesignerView,
  FloorKey,
  FurnitureCategory,
  PlacedFurniture,
} from "@/types/room3d";

const makeUid = (itemId: string) => `${itemId}-${crypto.randomUUID().slice(0, 8)}`;
const styleableRooms = plan.rooms.filter((room) => room.styleable);
const nameOf = (itemId: string) => furniture.find((item) => item.id === itemId)?.name ?? itemId;

function initialHistory(): History {
  const fromLink = window.location.hash.startsWith("#d=")
    ? decodeDesign(window.location.hash.slice(3), furniture, plan)
    : null;
  return { past: [], present: fromLink ?? defaultDesign(plan, DEFAULT_WALL), future: [] };
}

/**
 * The residence in 3D: orbit the apartment, drop furniture in, drag it about, turn it, and
 * repaint the walls and re-floor the rooms. Everything is a sample (plan, furniture, prices of
 * nothing): the design is yours, kept in the address so it can be shared.
 *
 * The three.js engine (src/lib/room3d) is fetched only here, on demand; this component is the
 * design's owner (what is placed, which finishes, undo and redo) and the controls around the
 * canvas. Keyboard: arrows move the selected piece, R turns it, Delete removes it, Ctrl+Z undoes.
 */
export default function ResidenceDesigner() {
  const stage = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<RoomDesigner | null>(null);
  const [history, dispatch] = useReducer(historyReducer, undefined, initialHistory);
  const design = history.present;
  const [selected, setSelected] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [tab, setTab] = useState<DesignerTab>("furniture");
  const [category, setCategory] = useState<FurnitureCategory | "all">("all");
  const [view, setView] = useState<DesignerView>("dollhouse");
  const [loading, setLoading] = useState(0);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  /* ---------- The engine, created once, on demand ---------- */
  useEffect(() => {
    const container = stage.current;
    if (!container) return;
    let cancelled = false;
    let created: RoomDesigner | null = null;
    import("@/lib/room3d/engine")
      .then(({ RoomDesigner }) => {
        if (cancelled) return;
        created = new RoomDesigner(container, plan, furniture, {
          onSelect: setSelected,
          onMove: (uid, x, z) =>
            dispatch({
              type: "commit",
              change: (current) => ({
                ...current,
                placed: current.placed.map((piece) =>
                  piece.uid === uid ? { ...piece, x, z } : piece,
                ),
              }),
            }),
          onLoading: setLoading,
        });
        setEngine(created);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      created?.dispose();
      setEngine(null);
    };
  }, []);

  /* ---------- The design, told to the engine ---------- */
  useEffect(() => {
    if (!engine) return;
    engine.setPlaced(design.placed);
    for (const styleable of styleableRooms) {
      const wall = WALL_FINISHES.find(
        (finish) => finish.key === design.finishes.walls[styleable.id],
      );
      if (wall) engine.setWallColor(styleable.id, wall.color);
      engine.setFloor(styleable.id, design.finishes.floors[styleable.id] ?? styleable.floor);
    }
  }, [engine, design]);

  useEffect(() => {
    engine?.select(selected);
  }, [engine, selected, design.placed]);

  /* ---------- Actions ---------- */
  const piece = design.placed.find((candidate) => candidate.uid === selected) ?? null;

  const change = useCallback(
    (fn: (current: Design) => Design) => dispatch({ type: "commit", change: fn }),
    [],
  );

  const updatePiece = useCallback(
    (uid: string, patch: (p: PlacedFurniture) => PlacedFurniture) =>
      change((current) => ({
        ...current,
        placed: current.placed.map((p) => {
          if (p.uid !== uid) return p;
          const next = patch(p);
          const fitted = engine?.fit(next) ?? { x: next.x, z: next.z };
          return { ...next, ...fitted };
        }),
      })),
    [change, engine],
  );

  const add = (itemId: string) => {
    const target = plan.rooms.find((candidate) => candidate.id === room) ?? plan.rooms[0];
    const n = design.placed.length;
    const uid = makeUid(itemId);
    const fresh: PlacedFurniture = {
      uid,
      itemId,
      x: target.x + target.width / 2 + ((n % 5) - 2) * 0.25,
      z: target.z + target.depth / 2 + ((n % 3) - 1) * 0.25,
      rotation: 0,
    };
    change((current) => ({ ...current, placed: [...current.placed, fresh] }));
    setSelected(uid);
  };

  const remove = () => {
    if (!piece) return;
    change((current) => ({
      ...current,
      placed: current.placed.filter((p) => p.uid !== piece.uid),
    }));
    setSelected(null);
  };

  const duplicate = () => {
    if (!piece) return;
    const uid = makeUid(piece.itemId);
    change((current) => ({
      ...current,
      placed: [...current.placed, { ...piece, uid, x: piece.x + 0.4, z: piece.z + 0.4 }],
    }));
    setSelected(uid);
  };

  const turn = (step: number) => {
    if (piece) updatePiece(piece.uid, (p) => ({ ...p, rotation: (p.rotation + step + 4) % 4 }));
  };

  const setWall = (key: string) =>
    change((current) => {
      const rooms = room ? [room] : styleableRooms.map((r) => r.id);
      const walls = { ...current.finishes.walls };
      for (const id of rooms) walls[id] = key;
      return { ...current, finishes: { ...current.finishes, walls } };
    });

  const setFloor = (key: FloorKey) =>
    change((current) => {
      const rooms = room ? [room] : styleableRooms.map((r) => r.id);
      const floors = { ...current.finishes.floors };
      for (const id of rooms) floors[id] = key;
      return { ...current, finishes: { ...current.finishes, floors } };
    });

  const applyMood = (id: string) => {
    const mood = MOODS.find((candidate) => candidate.id === id);
    if (!mood) return;
    change((current) => {
      const walls = { ...current.finishes.walls };
      const floors = { ...current.finishes.floors };
      for (const styleable of styleableRooms) {
        if ((MOOD_EXEMPT_ROOMS as readonly string[]).includes(styleable.id)) continue;
        walls[styleable.id] = mood.wall;
        floors[styleable.id] = mood.floor;
      }
      return { ...current, finishes: { walls, floors } };
    });
  };

  const focus = (id: string | null) => {
    setRoom(id);
    engine?.focusRoom(id);
    setView("dollhouse");
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#d=${encodeDesign(design, furniture)}`;
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* the address bar now holds the link */
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea")) return;
    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === "z") {
      event.preventDefault();
      dispatch({ type: event.shiftKey ? "redo" : "undo" });
    } else if (mod && event.key.toLowerCase() === "y") {
      event.preventDefault();
      dispatch({ type: "redo" });
    } else if (!piece) {
      if (event.key === "Escape") setSelected(null);
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      remove();
    } else if (event.key.toLowerCase() === "r") {
      turn(event.shiftKey ? -1 : 1);
    } else if (event.key === "Escape") {
      setSelected(null);
    } else if (event.key.startsWith("Arrow") && !target.closest("button, [role='tab']")) {
      event.preventDefault();
      const step = event.shiftKey ? 0.5 : DESIGNER.snap * 2;
      const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
      const dz = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
      updatePiece(piece.uid, (p) => ({ ...p, x: p.x + dx, z: p.z + dz }));
    }
  };

  /* ---------- What is shown ---------- */
  const credits = useMemo(() => {
    const used = new Set(design.placed.map((p) => p.itemId));
    return furniture.filter((item) => used.has(item.id) && item.source.license === "CC-BY");
  }, [design.placed]);
  const shown = furniture.filter((item) => category === "all" || item.category === category);
  const wallNow = room ? design.finishes.walls[room] : null;
  const floorNow = room ? design.finishes.floors[room] : null;

  return (
    <div
      className="grid gap-8 outline-none lg:grid-cols-[minmax(0,1fr)_23rem]"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onPointerDownCapture={(event) => event.currentTarget.focus({ preventScroll: true })}
    >
      {/* The room */}
      <div className="relative h-[68svh] min-h-96 overflow-hidden bg-stone lg:h-[min(80svh,50rem)]">
        <div ref={stage} className="absolute inset-0" />

        {!engine && !failed && (
          <p className="absolute inset-0 flex items-center justify-center label-mono text-fg-muted">
            Building the apartment…
          </p>
        )}
        {failed && (
          <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-fg-muted">
            The 3D designer needs WebGL, which this browser does not offer.
          </p>
        )}

        <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-3">
          <div
            role="group"
            aria-label="Rooms"
            className="pointer-events-auto flex max-w-full flex-wrap gap-px"
          >
            {[
              { id: null, label: "Whole plan" },
              ...plan.rooms.map((r) => ({ id: r.id, label: r.label })),
            ].map((item) => (
              <button
                key={item.id ?? "all"}
                type="button"
                aria-pressed={room === item.id}
                onClick={() => focus(item.id)}
                className={cn(
                  "cursor-pointer border px-2.5 py-1.5 label-mono text-[0.625rem] transition-colors duration-300",
                  room === item.id
                    ? "border-ink bg-ink text-white"
                    : "border-rule bg-white/85 text-fg hover:bg-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pointer-events-auto flex gap-px">
            {DESIGNER_VIEWS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={view === item.key}
                onClick={() => {
                  setView(item.key);
                  setRoom(null);
                  engine?.setView(item.key);
                }}
                className={cn(
                  "cursor-pointer border px-2.5 py-1.5 label-mono text-[0.625rem] transition-colors duration-300",
                  view === item.key
                    ? "border-ink bg-ink text-white"
                    : "border-rule bg-white/85 text-fg hover:bg-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <SampleBadge label="Sample plan and furniture" className="bg-white/85 text-fg-muted" />
          {loading > 0 && (
            <span className="label-mono text-[0.625rem] text-fg-muted">Loading {loading}…</span>
          )}
        </div>

        {/* The selected piece */}
        {piece && (
          <div
            role="toolbar"
            aria-label={`${nameOf(piece.itemId)}: actions`}
            className="absolute inset-x-3 bottom-12 flex flex-wrap items-center gap-px sm:inset-x-auto sm:right-3 sm:bottom-3"
          >
            <span className="border border-rule bg-white px-3 py-2 label-mono text-[0.625rem]">
              {nameOf(piece.itemId)}
            </span>
            {[
              { label: "Turn left (Shift+R)", icon: RotateCcw, run: () => turn(-1) },
              { label: "Turn right (R)", icon: RotateCw, run: () => turn(1) },
              { label: "Duplicate", icon: Copy, run: duplicate },
              { label: "Remove (Delete)", icon: Trash2, run: remove },
            ].map(({ label, icon: Icon, run }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                title={label}
                onClick={run}
                className="flex size-9 cursor-pointer items-center justify-center border border-rule bg-white transition-colors duration-300 hover:bg-ink hover:text-white"
              >
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The controls */}
      <aside className="flex flex-col gap-6" aria-label="Designer controls">
        <div className="flex items-center justify-between gap-3">
          <div role="tablist" aria-label="Designer sections" className="flex gap-6">
            {DESIGNER_TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={tab === item.key}
                onClick={() => setTab(item.key)}
                className={cn(
                  "cursor-pointer border-b py-1 text-small transition-colors duration-300",
                  tab === item.key
                    ? "border-fg text-fg"
                    : "border-transparent text-fg-muted hover:text-fg",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex gap-px">
            {[
              {
                label: "Undo (Ctrl+Z)",
                icon: Undo2,
                run: () => dispatch({ type: "undo" }),
                off: history.past.length === 0,
              },
              {
                label: "Redo (Ctrl+Shift+Z)",
                icon: Redo2,
                run: () => dispatch({ type: "redo" }),
                off: history.future.length === 0,
              },
            ].map(({ label, icon: Icon, run, off }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                title={label}
                disabled={off}
                onClick={run}
                className="flex size-9 cursor-pointer items-center justify-center border border-rule transition-colors duration-300 hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35"
              >
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-4" />
              </button>
            ))}
          </div>
        </div>

        {tab === "furniture" && (
          <div role="tabpanel" className="flex flex-col gap-5">
            <div role="group" aria-label="Category" className="flex flex-wrap gap-x-4 gap-y-1">
              {FURNITURE_CATEGORIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={category === item.key}
                  onClick={() => setCategory(item.key)}
                  className={cn(
                    "cursor-pointer border-b py-0.5 label-mono text-[0.625rem] transition-colors duration-300",
                    category === item.key
                      ? "border-fg text-fg"
                      : "border-transparent text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <ul className="max-h-72 overflow-y-auto border-t border-rule">
              {shown.map((item) => (
                <li key={item.id} className="border-b border-rule">
                  <button
                    type="button"
                    onClick={() => add(item.id)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-3 py-2.5 text-left text-small transition-colors duration-300 hover:text-accent"
                  >
                    <span className="flex items-center gap-3">
                      <Image
                        src={`/media/room3d/thumbs/${item.id}.webp`}
                        alt=""
                        width={44}
                        height={44}
                        unoptimized
                        className="size-11 object-contain"
                      />
                      <span>{item.name}</span>
                    </span>
                    <span className="label-mono text-[0.625rem] text-fg-muted group-hover:text-accent">
                      Add
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <p className="label-mono text-fg-muted">In the apartment · {design.placed.length}</p>
              <ul className="flex max-h-32 flex-wrap gap-1 overflow-y-auto">
                {design.placed.map((p) => (
                  <li key={p.uid}>
                    <button
                      type="button"
                      aria-pressed={selected === p.uid}
                      onClick={() => setSelected(p.uid)}
                      className={cn(
                        "cursor-pointer border px-2 py-1 text-[0.75rem] transition-colors duration-300",
                        selected === p.uid
                          ? "border-ink bg-ink text-white"
                          : "border-rule hover:bg-fg/5",
                      )}
                    >
                      {nameOf(p.itemId)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "finishes" && (
          <div role="tabpanel" className="flex flex-col gap-6">
            <p className="text-small text-fg-muted">
              {room
                ? `Choosing for ${plan.rooms.find((r) => r.id === room)?.label}. Pick “Whole plan” above to repaint every room.`
                : "Choosing for every room. Pick a room above to change just that one."}
            </p>
            <div className="flex flex-col gap-3">
              <p className="label-mono text-fg-muted">Walls</p>
              <ul className="grid grid-cols-4 gap-2">
                {WALL_FINISHES.map((finish) => (
                  <li key={finish.key}>
                    <button
                      type="button"
                      aria-pressed={wallNow === finish.key}
                      onClick={() => setWall(finish.key)}
                      className="group flex w-full cursor-pointer flex-col gap-1.5 text-left"
                    >
                      <span
                        className={cn(
                          "block h-10 border transition-[outline-offset] duration-300",
                          wallNow === finish.key
                            ? "border-ink outline outline-offset-2 outline-ink"
                            : "border-rule",
                        )}
                        style={{ backgroundColor: finish.color }}
                      />
                      <span className="label-mono text-[0.5625rem] text-fg-muted">
                        {finish.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <p className="label-mono text-fg-muted">Floor</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {FLOOR_FINISHES.map((finish) => (
                  <li key={finish.key}>
                    <button
                      type="button"
                      aria-pressed={floorNow === finish.key}
                      onClick={() => setFloor(finish.key)}
                      className={cn(
                        "cursor-pointer border-b py-1 text-small transition-colors duration-300",
                        floorNow === finish.key
                          ? "border-fg text-fg"
                          : "border-transparent text-fg-muted hover:text-fg",
                      )}
                    >
                      {finish.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "moods" && (
          <div role="tabpanel" className="flex flex-col gap-1">
            <p className="pb-3 text-small text-fg-muted">
              One click sets the walls and floors of every room except the bathroom. Your furniture
              stays where it is.
            </p>
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => applyMood(mood.id)}
                className="group flex cursor-pointer items-baseline justify-between gap-4 border-t border-rule py-4 text-left transition-colors duration-300 last:border-b hover:text-accent"
              >
                <span className="font-display text-display-sm">{mood.label}</span>
                <span className="text-small text-fg-muted group-hover:text-accent">
                  {mood.note}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-rule pt-5">
          <button
            type="button"
            onClick={share}
            className="inline-flex cursor-pointer items-center gap-2 label-mono text-fg transition-colors duration-300 hover:text-accent"
          >
            <Link2 aria-hidden="true" strokeWidth={1.5} className="size-4" />
            {copied ? "Link copied" : "Copy link to this design"}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "replace", design: defaultDesign(plan, DEFAULT_WALL) })}
            className="inline-flex cursor-pointer items-center gap-2 label-mono text-fg-muted transition-colors duration-300 hover:text-fg"
          >
            <LayoutTemplate aria-hidden="true" strokeWidth={1.5} className="size-4" />
            Start again
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: "commit", change: (current) => ({ ...current, placed: [] }) })
            }
            className="inline-flex cursor-pointer items-center gap-2 label-mono text-fg-muted transition-colors duration-300 hover:text-fg"
          >
            <Box aria-hidden="true" strokeWidth={1.5} className="size-4" />
            Empty the rooms
          </button>
        </div>

        <p className="text-[0.75rem] leading-relaxed text-fg-muted">
          Drag a piece to move it, drag the floor to look around, scroll or pinch to zoom. With a
          piece selected: arrow keys move it, R turns it, Delete removes it.
        </p>

        <details className="text-[0.75rem] text-fg-muted">
          <summary className="cursor-pointer label-mono">Model credits</summary>
          <ul className="mt-3 flex flex-col gap-2">
            <li>Most models: Poly Haven, CC0 (public domain).</li>
            {credits.map((item) => (
              <li key={item.id} title={item.source.credit}>
                {item.name} by{" "}
                <a
                  href={item.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-fg/30 underline-offset-4 hover:decoration-fg"
                >
                  {item.source.author}
                </a>
                , CC BY 4.0, via Sketchfab.
              </li>
            ))}
          </ul>
        </details>
      </aside>
    </div>
  );
}
