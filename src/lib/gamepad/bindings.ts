import type { HotkeyId, HotkeyScope } from "@/lib/hotkeys";
import type { Layout } from "./layout";
import type { GpButton } from "./protocol";

// Controller buttons as hotkeys. A chord is one button ("south") or a held
// shoulder/trigger plus a button ("lt+south"), the way Ctrl+key works on a
// keyboard. Bindings are stored per chord, since a pad has few buttons and
// one action often has two (LT and D-pad left both seek back).
//
// Lookup-scope chords live under a "lookup:" prefix: they only apply while
// picking a word in the subtitles, so they can reuse buttons the player uses.

export const PAD_BUTTONS: readonly GpButton[] = [
  "south",
  "east",
  "west",
  "north",
  "lb",
  "rb",
  "lt",
  "rt",
  "dup",
  "ddown",
  "dleft",
  "dright",
  "start",
  "back",
  "guide",
  "lstick",
  "rstick",
];

export const PAD_MODIFIERS: readonly GpButton[] = ["lb", "rb", "lt", "rt"];

export type PadMode = "normal" | "lookup";

/** Override map stored in settings: storage key → action, "" = unbound. */
export type PadOverrides = Record<string, string>;

// What the player does with each button today. Kept as defaults so nothing
// changes until the user rebinds something.
export const DEFAULT_PAD_BINDINGS: Readonly<Record<string, HotkeyId>> = {
  south: "playerPlayPause",
  east: "playerClose",
  west: "playerSubtitleCycle",
  north: "playerStats",
  lb: "playerPrevEpisode",
  rb: "playerNextEpisode",
  lt: "playerSeekBack10",
  rt: "playerSeekForward10",
  dleft: "playerSeekBack10",
  dright: "playerSeekForward10",
  dup: "playerVolumeUp",
  ddown: "playerVolumeDown",
  "lookup:dright": "lookupNextWord",
  "lookup:dleft": "lookupPrevWord",
  "lookup:dup": "lookupPrevLine",
  "lookup:ddown": "lookupNextLine",
  "lookup:south": "lookupOpenPopup",
  "lookup:rb": "lookupAddAnki",
  "lookup:north": "lookupAiExplain",
  "lookup:west": "lookupWordAudio",
  "lookup:east": "lookupExit",
};

export function padModeOf(scope: HotkeyScope): PadMode {
  return scope === "Lookup" ? "lookup" : "normal";
}

export function padStorageKey(mode: PadMode, chord: string): string {
  return mode === "lookup" ? `lookup:${chord}` : chord;
}

function chordOfKey(key: string): { mode: PadMode; chord: string } {
  return key.startsWith("lookup:")
    ? { mode: "lookup", chord: key.slice("lookup:".length) }
    : { mode: "normal", chord: key };
}

/** Every bound chord with its action, defaults merged with overrides. */
export function effectivePadBindings(overrides: PadOverrides | undefined): Map<string, HotkeyId> {
  const out = new Map<string, HotkeyId>();
  for (const [k, id] of Object.entries(DEFAULT_PAD_BINDINGS)) out.set(k, id);
  for (const [k, id] of Object.entries(overrides ?? {})) {
    if (id) out.set(k, id as HotkeyId);
    else out.delete(k);
  }
  return out;
}

/** The action a chord triggers in a mode, or null. */
export function padAction(
  overrides: PadOverrides | undefined,
  mode: PadMode,
  chord: string,
): HotkeyId | null {
  return effectivePadBindings(overrides).get(padStorageKey(mode, chord)) ?? null;
}

/** True when the chord still does what the player always did with it. */
export function isDefaultPadBinding(
  overrides: PadOverrides | undefined,
  mode: PadMode,
  chord: string,
): boolean {
  const key = padStorageKey(mode, chord);
  return !(key in (overrides ?? {})) && key in DEFAULT_PAD_BINDINGS;
}

/** Chords bound to an action, in a stable order. */
export function padChordsFor(
  overrides: PadOverrides | undefined,
  id: HotkeyId,
  mode: PadMode,
): string[] {
  const out: string[] = [];
  for (const [key, action] of effectivePadBindings(overrides)) {
    const c = chordOfKey(key);
    if (action === id && c.mode === mode) out.push(c.chord);
  }
  return out.sort((a, b) => chordOrder(a) - chordOrder(b));
}

function chordOrder(chord: string): number {
  const [first, second] = chord.split("+");
  const base = PAD_BUTTONS.indexOf(second ? (second as GpButton) : (first as GpButton));
  return (second ? 100 + PAD_MODIFIERS.indexOf(first as GpButton) * 20 : 0) + base;
}

/** Whether some binding in this mode starts with `modifier+`, meaning the
 *  button has to wait for its release before acting on its own. */
export function modifierInUse(
  overrides: PadOverrides | undefined,
  mode: PadMode,
  modifier: GpButton,
): boolean {
  const prefix = padStorageKey(mode, `${modifier}+`);
  for (const key of effectivePadBindings(overrides).keys()) if (key.startsWith(prefix)) return true;
  return false;
}

/** Binds a chord to an action, replacing whatever it did before. */
export function bindPad(
  overrides: PadOverrides | undefined,
  mode: PadMode,
  chord: string,
  id: HotkeyId,
): PadOverrides {
  const key = padStorageKey(mode, chord);
  const next = { ...(overrides ?? {}) };
  if (DEFAULT_PAD_BINDINGS[key] === id) delete next[key];
  else next[key] = id;
  return next;
}

/** Removes a chord from whatever it was bound to. */
export function unbindPad(
  overrides: PadOverrides | undefined,
  mode: PadMode,
  chord: string,
): PadOverrides {
  const key = padStorageKey(mode, chord);
  const next = { ...(overrides ?? {}) };
  if (key in DEFAULT_PAD_BINDINGS) next[key] = "";
  else delete next[key];
  return next;
}

/** Puts an action back to its default chords: frees chords taken from it and
 *  drops the ones added to it. */
export function resetPadFor(overrides: PadOverrides | undefined, id: HotkeyId): PadOverrides {
  const next = { ...(overrides ?? {}) };
  for (const [key, action] of Object.entries(next)) {
    if (action === id || DEFAULT_PAD_BINDINGS[key] === id) delete next[key];
  }
  return next;
}

/** Whether the user changed this action's controller buttons. */
export function padCustomized(overrides: PadOverrides | undefined, id: HotkeyId): boolean {
  return Object.entries(overrides ?? {}).some(
    ([key, action]) => action === id || DEFAULT_PAD_BINDINGS[key] === id,
  );
}

const NAMES: Record<Layout, Record<GpButton, string>> = {
  xbox: {
    south: "A",
    east: "B",
    west: "X",
    north: "Y",
    lb: "LB",
    rb: "RB",
    lt: "LT",
    rt: "RT",
    dup: "D-pad ↑",
    ddown: "D-pad ↓",
    dleft: "D-pad ←",
    dright: "D-pad →",
    start: "Menu",
    back: "View",
    guide: "Guide",
    lstick: "L3",
    rstick: "R3",
  },
  ps: {
    south: "✕",
    east: "○",
    west: "□",
    north: "△",
    lb: "L1",
    rb: "R1",
    lt: "L2",
    rt: "R2",
    dup: "D-pad ↑",
    ddown: "D-pad ↓",
    dleft: "D-pad ←",
    dright: "D-pad →",
    start: "Options",
    back: "Create",
    guide: "PS",
    lstick: "L3",
    rstick: "R3",
  },
};

export function formatPadChord(chord: string, layout: Layout = "xbox"): string {
  return chord
    .split("+")
    .map((b) => NAMES[layout][b as GpButton] ?? b)
    .join(" + ");
}

/** A KeyboardEvent init that `eventToBinding` turns back into `binding`, so a
 *  controller button can trigger a keyboard hotkey through its own handler. */
export function bindingToKeyInit(binding: string): KeyboardEventInit | null {
  if (!binding) return null;
  const parts = binding.split("+");
  // "shift++" style bindings end in an empty part for the "+" key itself.
  let key = parts.pop() ?? "";
  if (key === "" && binding.endsWith("+")) key = "+";
  const mods = new Set(parts);
  if (key === "Space") key = " ";
  return {
    key,
    code: key.length === 1 && /[a-z]/i.test(key) ? `Key${key.toUpperCase()}` : key,
    ctrlKey: mods.has("ctrl"),
    shiftKey: mods.has("shift"),
    altKey: mods.has("alt"),
    metaKey: mods.has("meta"),
    bubbles: true,
    cancelable: true,
  };
}
