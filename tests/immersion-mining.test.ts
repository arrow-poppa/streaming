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

test("subtitle line seek goes to the next start, or to the line before", () => {
  const cues = [
    { start: 1, end: 2, text: "a" },
    { start: 4, end: 5, text: "b" },
    { start: 8, end: 9, text: "c" },
  ];
  assert.equal(subCueSeekTarget(cues, 4.2, 1), 8);
  assert.equal(subCueSeekTarget(cues, 4.9, -1), 1, "inside a line: the line before");
  assert.equal(subCueSeekTarget(cues, 3.98, -1), 1, "landed just before a line: the line before");
  assert.equal(subCueSeekTarget(cues, 6, -1), 4, "between lines: the one that just played");
  assert.equal(subCueSeekTarget(cues, 1.5, -1), null);
  assert.equal(subCueSeekTarget(cues, 9, 1), null);
});

test("replay targets the line's start in playback time", () => {
  const line = lineFromSnapshot({
    subText: "otra vez",
    subStartSec: 12,
    subEndSec: 14,
    subDelaySec: -0.5,
  });
  assert.equal(line?.start, 11.5);
});

test("a selected word is found again inside a recording's text", async () => {
  const { locateWord } = await import("../src/lib/player/word-selection.ts");
  const sel = { sentence: "No quiero ir", matchStart: 3, matchLength: 6 };
  assert.deepEqual(locateWord(sel, "Hola.\nNo quiero ir"), { matchStart: 9, matchLength: 6 });
  assert.deepEqual(locateWord(sel, "Otra cosa"), { matchStart: 0, matchLength: 0 });
});

test("popup size stays between 75% and 250% and steps by 10", async () => {
  const { sanitizePopupSize, stepPopupSize } =
    await import("../src/lib/player/lookup-popup-size.ts");
  assert.equal(sanitizePopupSize(undefined, 100), 100);
  assert.equal(sanitizePopupSize(400, 100), 250);
  assert.equal(sanitizePopupSize(50, 100), 75);
  assert.equal(stepPopupSize(100, 1), 110);
  assert.equal(stepPopupSize(80, -1), 75);
  assert.equal(stepPopupSize(245, 1), 250);
});

test("hidden subtitles are a player-wide flag that listeners follow", async () => {
  const { isSubsHidden, setSubsHidden } = await import("../src/lib/player/subs-hidden.ts");
  assert.equal(isSubsHidden(), false);
  setSubsHidden(true);
  assert.equal(isSubsHidden(), true);
  setSubsHidden(false);
  assert.equal(isSubsHidden(), false);
});
