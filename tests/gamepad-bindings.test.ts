// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import assert from "node:assert/strict";
// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import test from "node:test";
import {
  bindPad,
  bindingToKeyInit,
  isDefaultPadBinding,
  modifierInUse,
  padAction,
  padChordsFor,
  padCustomized,
  resetPadFor,
  unbindPad,
} from "../src/lib/gamepad/bindings.ts";
import {
  firstWord,
  nextWord,
  prevWord,
  wordLength,
  wordOnOtherLine,
} from "../src/lib/player/lookup-nav.ts";

test("untouched controllers keep doing what the player always did", () => {
  assert.equal(padAction({}, "normal", "south"), "playerPlayPause");
  assert.equal(padAction({}, "normal", "lt"), "playerSeekBack10");
  assert.ok(isDefaultPadBinding({}, "normal", "south"));
  assert.deepEqual(padChordsFor({}, "playerSeekBack10", "normal"), ["lt", "dleft"]);
  assert.equal(modifierInUse({}, "normal", "lt"), false, "no combination means LT acts on press");
});

test("binding a chord moves it to the new action", () => {
  const pad = bindPad({}, "normal", "south", "playerAnkiNewCard");
  assert.equal(padAction(pad, "normal", "south"), "playerAnkiNewCard");
  assert.deepEqual(padChordsFor(pad, "playerPlayPause", "normal"), []);
  assert.equal(isDefaultPadBinding(pad, "normal", "south"), false);
  assert.ok(padCustomized(pad, "playerPlayPause"));
  assert.ok(padCustomized(pad, "playerAnkiNewCard"));
});

test("combinations make the shoulder wait, and resetting gives the defaults back", () => {
  let pad = bindPad({}, "normal", "lt+south", "playerRecordNew");
  assert.equal(padAction(pad, "normal", "lt+south"), "playerRecordNew");
  assert.ok(modifierInUse(pad, "normal", "lt"));
  assert.equal(padAction(pad, "normal", "lt"), "playerSeekBack10", "LT alone keeps its job");
  pad = unbindPad(pad, "normal", "dleft");
  assert.equal(padAction(pad, "normal", "dleft"), null);
  pad = resetPadFor(pad, "playerSeekBack10");
  assert.equal(padAction(pad, "normal", "dleft"), "playerSeekBack10");
  assert.deepEqual(resetPadFor(pad, "playerRecordNew"), {});
});

test("word lookup buttons are their own layer", () => {
  assert.equal(padAction({}, "lookup", "dright"), "lookupNextWord");
  assert.equal(
    padAction({}, "lookup", "south"),
    "lookupOpenPopup",
    "A opens the popup, it never opens on its own",
  );
  assert.equal(padAction({}, "lookup", "rb"), "lookupAddAnki");
  assert.equal(padAction({}, "normal", "dright"), "playerSeekForward10");
  assert.equal(modifierInUse({}, "lookup", "lb"), false);
});

test("a keyboard binding replays as the key that produced it", () => {
  assert.deepEqual(
    { ...bindingToKeyInit("ctrl+alt+r"), bubbles: undefined, cancelable: undefined },
    {
      key: "r",
      code: "KeyR",
      ctrlKey: true,
      shiftKey: false,
      altKey: true,
      metaKey: false,
      bubbles: undefined,
      cancelable: undefined,
    },
  );
  assert.equal(bindingToKeyInit("Space")?.key, " ");
  assert.equal(bindingToKeyInit("ctrl++")?.key, "+");
  assert.equal(bindingToKeyInit(""), null);
});

test("picking words steps through spaced text", () => {
  const lines = ["— Don't go, well-known friend!", "", "Next line"];
  const a = firstWord(lines)!;
  assert.deepEqual(a, { line: 0, index: 2 });
  assert.equal(wordLength(lines[0], a.index), 5, "don't is one word");
  const b = nextWord(lines, a)!;
  assert.equal(lines[0].slice(b.index, b.index + wordLength(lines[0], b.index)), "go");
  const c = nextWord(lines, b)!;
  assert.equal(lines[0].slice(c.index, c.index + wordLength(lines[0], c.index)), "well-known");
  const d = nextWord(lines, nextWord(lines, c)!)!;
  assert.deepEqual(d, { line: 2, index: 0 }, "skips the empty line");
  assert.deepEqual(prevWord(lines, d), nextWord(lines, c));
  assert.deepEqual(prevWord(lines, b), a);
  assert.equal(prevWord(lines, a), null);
  assert.deepEqual(wordOnOtherLine(lines, a, 1), { line: 2, index: 0 });
  assert.equal(wordOnOtherLine(lines, a, -1), null);
});

test("picking words in Japanese follows the dictionary match", () => {
  const lines = ["私は学生です。"];
  const a = firstWord(lines)!;
  assert.deepEqual(nextWord(lines, a, 1), { line: 0, index: 1 });
  assert.deepEqual(
    nextWord(lines, { line: 0, index: 2 }, 2),
    { line: 0, index: 4 },
    "学生 is two characters",
  );
  assert.equal(nextWord(lines, { line: 0, index: 4 }, 2), null, "the full stop is not a word");
});
