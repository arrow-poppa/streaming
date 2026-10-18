import { useSyncExternalStore } from "react";
import type { HotkeyId } from "@/lib/hotkeys";

// Picking a word in the subtitles without the mouse: a mode the keyboard and
// the controller enter, during which their Lookup bindings drive the subtitle
// and its dictionary popup instead of the player.

export type LookupCommand =
  | "toggle"
  | "exit"
  | "nextWord"
  | "prevWord"
  | "prevLine"
  | "nextLine"
  | "popup"
  | "anki"
  | "ai"
  | "audio"
  | "scrollDown"
  | "scrollUp";

/** The Lookup-scope hotkeys and the command each one sends. */
export const LOOKUP_ACTIONS: ReadonlyArray<readonly [HotkeyId, LookupCommand]> = [
  ["lookupNextWord", "nextWord"],
  ["lookupPrevWord", "prevWord"],
  ["lookupPrevLine", "prevLine"],
  ["lookupNextLine", "nextLine"],
  ["lookupOpenPopup", "popup"],
  ["lookupAddAnki", "anki"],
  ["lookupAiExplain", "ai"],
  ["lookupWordAudio", "audio"],
  ["lookupScrollDown", "scrollDown"],
  ["lookupScrollUp", "scrollUp"],
  ["lookupExit", "exit"],
];

let active = false;
const stateListeners = new Set<() => void>();
const commandListeners = new Set<(cmd: LookupCommand, amount: number) => boolean>();

export function setLookupNavActive(on: boolean): void {
  if (active === on) return;
  active = on;
  for (const l of stateListeners) l();
}

export function isLookupNavActive(): boolean {
  return active;
}

// Subtitles with their dictionary popup on screen, however it was opened (the
// mouse, the controller pointer or the mode), so the Leave word lookup key
// can close it instead of doing its player job.
const openPopups = new Set<object>();

export function setLookupPopupOpen(owner: object, open: boolean): void {
  if (open) openPopups.add(owner);
  else openPopups.delete(owner);
}

export function isLookupPopupOpen(): boolean {
  return openPopups.size > 0;
}

export function useLookupNavActive(): boolean {
  return useSyncExternalStore(
    (cb) => {
      stateListeners.add(cb);
      return () => stateListeners.delete(cb);
    },
    () => active,
    () => false,
  );
}

/** Sends a command to the subtitle and popup on screen. Returns whether one
 *  handled it, false when there is no subtitle to pick from. `amount` scales
 *  the scroll commands (an analog stick sends less than a full step). */
export function sendLookupCommand(cmd: LookupCommand, amount = 1): boolean {
  let handled = false;
  for (const l of commandListeners) handled = l(cmd, amount) || handled;
  return handled;
}

export function onLookupCommand(fn: (cmd: LookupCommand, amount: number) => boolean): () => void {
  commandListeners.add(fn);
  return () => {
    commandListeners.delete(fn);
  };
}

// ---------- moving between words ----------

export type WordPos = { line: number; index: number };

const WORD = /[\p{L}\p{M}\p{N}]/u;
// Letters glued inside a word in spaced scripts: "don't", "well-known".
const JOINER = /['’-]/;
const NO_SPACE =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}]/u;

const isWord = (c: string | undefined) => !!c && WORD.test(c);
const isNoSpace = (c: string | undefined) => !!c && NO_SPACE.test(c);

function firstInLine(text: string, from = 0): number {
  for (let i = from; i < text.length; i++) if (isWord(text[i])) return i;
  return -1;
}

/** The first word of the subtitle, or of the line `line` onwards. */
export function firstWord(lines: string[], line = 0): WordPos | null {
  for (let l = line; l < lines.length; l++) {
    const i = firstInLine(lines[l] ?? "");
    if (i >= 0) return { line: l, index: i };
  }
  return null;
}

/** The word after the one at `pos`. `matched` is how many UTF-16 units the
 *  dictionary matched there, which is how far a word reaches in Japanese or
 *  Chinese; in spaced scripts the word simply runs to the next space. */
export function nextWord(lines: string[], pos: WordPos, matched = 0): WordPos | null {
  const text = lines[pos.line] ?? "";
  let i = pos.index;
  if (isNoSpace(text[i])) {
    i += Math.max(1, matched);
  } else {
    while (
      i < text.length &&
      (isWord(text[i]) || (JOINER.test(text[i]) && isWord(text[i + 1]))) &&
      !isNoSpace(text[i])
    )
      i++;
    if (i === pos.index) i++;
  }
  const same = firstInLine(text, i);
  if (same >= 0) return { line: pos.line, index: same };
  return firstWord(lines, pos.line + 1);
}

/** The word before `pos`, starting from its first letter. */
export function prevWord(lines: string[], pos: WordPos): WordPos | null {
  let line = pos.line;
  let i = pos.index - 1;
  while (line >= 0) {
    const text = lines[line] ?? "";
    while (i >= 0 && !isWord(text[i])) i--;
    if (i >= 0) {
      if (isNoSpace(text[i])) return { line, index: i };
      while (
        i > 0 &&
        !isNoSpace(text[i - 1]) &&
        (isWord(text[i - 1]) || (JOINER.test(text[i - 1]) && isWord(text[i - 2])))
      )
        i--;
      return { line, index: i };
    }
    line--;
    i = (lines[line] ?? "").length - 1;
  }
  return null;
}

/** First word of the line above (-1) or below (1); null at either end. */
export function wordOnOtherLine(lines: string[], pos: WordPos, dir: 1 | -1): WordPos | null {
  for (let l = pos.line + dir; l >= 0 && l < lines.length; l += dir) {
    const i = firstInLine(lines[l] ?? "");
    if (i >= 0) return { line: l, index: i };
  }
  return null;
}

/** UTF-16 length of the word at `pos`, for highlighting it when no
 *  dictionary entry matched. */
export function wordLength(text: string, index: number): number {
  if (isNoSpace(text[index])) return 1;
  let i = index;
  while (
    i < text.length &&
    (isWord(text[i]) || (JOINER.test(text[i]) && isWord(text[i + 1]))) &&
    !isNoSpace(text[i])
  )
    i++;
  return Math.max(1, i - index);
}
