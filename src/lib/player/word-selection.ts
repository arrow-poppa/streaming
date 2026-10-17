import type { MiningContext } from "@/lib/mining/anki";

// The word the user has selected in the subtitles: highlighted in the
// pick-a-word mode, or shown in an open dictionary popup. The immersion card
// hotkeys read it, so a card made while a word is selected carries the word
// and its definitions like the popup's Anki button does.

export type WordSelection = Pick<
  MiningContext,
  "term" | "sentence" | "matchStart" | "matchLength" | "aiExplanation"
>;

let current: { owner: object; selection: WordSelection } | null = null;

export function setWordSelection(owner: object, selection: WordSelection | null): void {
  if (selection) current = { owner, selection };
  else if (current?.owner === owner) current = null;
}

export function getWordSelection(): WordSelection | null {
  return current?.selection ?? null;
}

/** Where the selected word sits in another text (a recording joins several
 *  lines), so it can still be bolded or clozed; length 0 when it is absent. */
export function locateWord(
  selection: Pick<WordSelection, "sentence" | "matchStart" | "matchLength">,
  text: string,
): { matchStart: number; matchLength: number } {
  const word = selection.sentence.slice(
    selection.matchStart,
    selection.matchStart + selection.matchLength,
  );
  const at = word ? text.indexOf(word) : -1;
  return at >= 0 ? { matchStart: at, matchLength: word.length } : { matchStart: 0, matchLength: 0 };
}
