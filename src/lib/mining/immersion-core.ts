// Pure helpers of the immersion cards, kept free of Tauri and settings imports.

type Snap = { subText: string; subStartSec: number; subEndSec?: number; subDelaySec: number };

/** The line on screen in playback time, or null without one.
 *  mpv's sub-start/sub-end leave sub-delay out (measured on mpv 0.41: with a
 *  2s delay a 5–8s line shows at 7–10s and sub-start still says 5), so
 *  without adding it the audio is off by exactly the correction. */
export function lineFromSnapshot(snap: Snap): { text: string; start: number; end: number } | null {
  const text = snap.subText.trim();
  if (!text || snap.subEndSec == null || !(snap.subEndSec > snap.subStartSec)) return null;
  const delay = Number.isFinite(snap.subDelaySec) ? snap.subDelaySec : 0;
  return { text, start: snap.subStartSec + delay, end: snap.subEndSec + delay };
}

/** Appends a line seen during a recording, skipping repeats (VTT often
 *  repeats a line across consecutive cues). */
export function pushLine(lines: string[], text: string): void {
  const line = text.trim();
  if (line && lines[lines.length - 1] !== line) lines.push(line);
}

/** The newest note id when it was added within `windowMin` minutes. A note id
 *  is its creation time in milliseconds. */
export function newestRecentNote(ids: number[], nowMs: number, windowMin: number): number | null {
  if (!ids.length) return null;
  const newest = Math.max(...ids);
  return nowMs - newest <= windowMin * 60_000 ? newest : null;
}

/** Fills a first field that would be empty without showing anything on the
 *  card. Anki refuses a note whose first field is empty and checks duplicates
 *  on it, so the marker is a zero-width fingerprint of the other fields:
 *  invisible, and different for every note. */
export function invisibleMarker(fields: Record<string, string>): string {
  const json = JSON.stringify(
    Object.keys(fields)
      .sort()
      .map((k) => [k, fields[k]]),
  );
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < json.length; i++) {
    const c = json.charCodeAt(i);
    a = Math.imul(a ^ c, 0x01000193) >>> 0;
    b = Math.imul(b ^ c, 0x5bd1e995) >>> 0;
  }
  const bits = a.toString(2).padStart(32, "0") + b.toString(2).padStart(32, "0");
  return Array.from(bits, (bit) => (bit === "0" ? "​" : "‌")).join("");
}
