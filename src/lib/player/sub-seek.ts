import type { SubCue } from "@/lib/subtitles/parser";

// A line counts as "just started" this long after its start, so pressing
// previous right after it began goes to the line before, like mpv's sub-seek.
const RESTART_GRACE_SEC = 0.6;

/** Start of the next (dir 1) or previous (dir -1) cue relative to `pos`, in
 *  subtitle time. Previous means the current line when it is already under
 *  way, the line before it when it has only just started. */
export function subCueSeekTarget(cues: SubCue[], pos: number, dir: 1 | -1): number | null {
  const starts = [...new Set(cues.map((c) => c.start))].sort((a, b) => a - b);
  if (dir === 1) return starts.find((s) => s > pos + 0.05) ?? null;
  for (let i = starts.length - 1; i >= 0; i--) {
    if (starts[i] < pos - RESTART_GRACE_SEC) return starts[i];
  }
  return null;
}
