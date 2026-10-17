// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import assert from "node:assert/strict";
// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import test from "node:test";
import {
  invisibleMarker,
  lineFromSnapshot,
  newestRecentNote,
  pushLine,
} from "../src/lib/mining/immersion-core.ts";
import { subCueSeekTarget } from "../src/lib/player/sub-seek.ts";

test("the line on screen is shifted by the subtitle delay", () => {
  const line = lineFromSnapshot({
    subText: " hola ",
    subStartSec: 5,
    subEndSec: 8,
    subDelaySec: 2,
  });
  assert.deepEqual(line, { text: "hola", start: 7, end: 10 });
});

test("no line without text or timing", () => {
  assert.equal(
    lineFromSnapshot({ subText: "", subStartSec: 5, subEndSec: 8, subDelaySec: 0 }),
    null,
  );
  assert.equal(lineFromSnapshot({ subText: "x", subStartSec: 5, subDelaySec: 0 }), null);
});

test("a recording keeps each line once, in order", () => {
  const lines: string[] = [];
  for (const t of ["a", "a", "", "b", "b ", "a"]) pushLine(lines, t);
  assert.deepEqual(lines, ["a", "b", "a"]);
});

test("update last card only touches a recent note", () => {
  const now = 1_000_000_000;
  assert.equal(newestRecentNote([now - 120_000, now - 30_000], now, 10), now - 30_000);
  assert.equal(newestRecentNote([now - 11 * 60_000], now, 10), null);
  assert.equal(newestRecentNote([], now, 10), null);
});

test("the first-field marker is invisible and differs per note", () => {
  const a = invisibleMarker({ Sentence: "a", Audio: "[sound:1.mp3]" });
  const b = invisibleMarker({ Sentence: "b", Audio: "[sound:1.mp3]" });
  assert.equal(a.length, 64);
  assert.match(a, /^[​‌]+$/);
  assert.notEqual(a, b);
  assert.equal(
    a,
    invisibleMarker({ Audio: "[sound:1.mp3]", Sentence: "a" }),
    "field order does not matter",
  );
});

test("subtitle line seek goes to the next start, or back past a line that just began", () => {
  const cues = [
    { start: 1, end: 2, text: "a" },
    { start: 4, end: 5, text: "b" },
    { start: 8, end: 9, text: "c" },
  ];
  assert.equal(subCueSeekTarget(cues, 4.2, 1), 8);
  assert.equal(subCueSeekTarget(cues, 4.9, -1), 4, "well into a line: its own start");
  assert.equal(subCueSeekTarget(cues, 4.2, -1), 1, "just started: the line before");
  assert.equal(subCueSeekTarget(cues, 9, 1), null);
});
