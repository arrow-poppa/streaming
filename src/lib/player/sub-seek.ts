import type { SubCue } from "@/lib/subtitles/parser";

// A seek can land a hair before the line it aimed for.
const LAND_SLACK_SEC = 0.05;

/** Start of the next (dir 1) or previous (dir -1) cue relative to `pos`, in
 *  subtitle time. Previous is always the line before the one on screen (or,
 *  between lines, the one that just played); replaying the current line is a
 *  separate hotkey. */
export function subCueSeekTarget(cues: SubCue[], pos: number, dir: 1 | -1): number | null {
  const starts = [...new Set(cues.map((c) => c.start))].sort((a, b) => a - b);
  if (dir === 1) return starts.find((s) => s > pos + LAND_SLACK_SEC) ?? null;
  const onScreen = cues
    .filter((c) => c.start <= pos + LAND_SLACK_SEC && pos < c.end)
    .reduce<number | null>(
      (latest, c) => (latest === null || c.start > latest ? c.start : latest),
      null,
    );
  for (let i = starts.length - 1; i >= 0; i--) {
    if (onScreen === null ? starts[i] <= pos : starts[i] < onScreen) return starts[i];
  }
  return null;
}
