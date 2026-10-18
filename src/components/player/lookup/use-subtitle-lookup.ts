import { useCallback, useEffect, useRef, useState } from "react";
import { codePointsToUtf16, lookupDictionary, type DictLookupResult, type DictTerm } from "@/lib/mining/dictionary";

export type LookupControls = {
  isPlaying: () => boolean;
  togglePlay: () => void;
  // Hides/shows the subtitles mpv draws itself (ASS/native mode).
  setNativeSubVisible: (on: boolean) => void;
  title: string;
  mpvEngine: boolean;
  // Current sub-delay, read when a card is added.
  subDelaySec: () => number;
};

export type LookupHit = { line: number; start: number; length: number };
export type ScanKey = "none" | "shift" | "ctrl" | "alt";

const WORD_CHAR = /[\p{L}\p{M}\p{N}'’-]/u;

const NO_SPACE_CHAR = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}]/u;

// Elided articles and prepositions glued to the next word with an
// apostrophe: "l’homme", "qu’il", "dell’arte". The lookup starts after them.
const ELISIONS: Record<string, Set<string>> = {
  french: new Set(["l", "d", "j", "m", "n", "s", "t", "c", "qu", "jusqu", "lorsqu", "puisqu", "quoiqu", "presqu"]),
  italian: new Set(["l", "d", "un", "dell", "dall", "nell", "sull", "all", "coll", "quell", "bell", "sant", "quest", "nessun", "buon", "c", "m", "t", "s", "v", "n"]),
};
const APOSTROPHE = /['’‘ʼ]/;
const LETTER = /[\p{L}\p{M}]/u;

// Words in space-delimited scripts are looked up from their start, as Yomitan
// does; otherwise hovering the "o" of "don't" finds "on". Japanese/Chinese
// text keeps the exact hovered position. Decided per character, so it works
// whatever the lookup language is set to.
export function wordStartIndex(text: string, index: number, language = ""): number {
  if (NO_SPACE_CHAR.test(text[index] ?? "")) return index;
  let i = index;
  while (i > 0 && WORD_CHAR.test(text[i - 1]) && !NO_SPACE_CHAR.test(text[i - 1])) i--;
  const elisions = ELISIONS[language];
  if (!elisions) return i;
  let j = i;
  while (j < text.length && LETTER.test(text[j])) j++;
  if (j > i && APOSTROPHE.test(text[j] ?? "") && LETTER.test(text[j + 1] ?? "") && elisions.has(text.slice(i, j).toLowerCase())) {
    return j + 1;
  }
  return i;
}

function scanKeyHeld(key: ScanKey, e: { shiftKey: boolean; ctrlKey: boolean; altKey: boolean; metaKey?: boolean }) {
  if (key === "shift") return e.shiftKey;
  if (key === "ctrl") return e.ctrlKey || !!e.metaKey;
  if (key === "alt") return e.altKey;
  return true;
}

const SCAN_KEY_NAMES: Record<Exclude<ScanKey, "none">, string[]> = {
  shift: ["Shift"],
  ctrl: ["Control", "Meta"],
  alt: ["Alt"],
};

// The word starting at `index` in a space-delimited script, without edge
// apostrophes or hyphens; "" in no-space scripts, where a word's end is unknown.
export function wordAt(text: string, index: number): string {
  if (NO_SPACE_CHAR.test(text[index] ?? "")) return "";
  let end = index;
  while (end < text.length && WORD_CHAR.test(text[end]) && !NO_SPACE_CHAR.test(text[end])) end++;
  return text.slice(index, end).replace(/^['’-]+|['’-]+$/g, "");
}

function unknownWordTerm(word: string): DictTerm {
  return {
    headword: word,
    reading: "",
    furigana: [],
    glossary: [],
    frequencies: [],
    pitchAccents: [],
    forms: [],
    termTags: [],
    matchLen: Array.from(word).length,
    synthetic: true,
  };
}

const CLOSE_GRACE_MS = 280;
// The controller pointer crosses the gap to the popup much slower than a mouse.
const PAD_CLOSE_GRACE_MS = 1000;

// Maps a pointer position to a UTF-16 offset inside one rendered subtitle line.
// Text spans carry data-hb-line / data-hb-off (offset of their first character).
// Scans character boxes instead of using caretRangeFromPoint, which WebKitGTK
// and Chromium answer differently under the app-wide `user-select: none`.
export function hitTestSubtitle(x: number, y: number): { line: number; index: number } | null {
  const span = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-hb-off]");
  const node = span?.firstChild;
  if (!span || !node || node.nodeType !== Node.TEXT_NODE) return null;
  const text = node.textContent ?? "";
  const range = document.createRange();
  for (let o = 0; o < text.length; ) {
    const c = text.charCodeAt(o);
    const width = c >= 0xd800 && c <= 0xdbff && o + 1 < text.length ? 2 : 1;
    range.setStart(node, o);
    range.setEnd(node, o + width);
    for (const rect of Array.from(range.getClientRects())) {
      if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) {
        if (/\s/.test(text[o])) return null;
        return { line: Number(span.dataset.hbLine), index: Number(span.dataset.hbOff) + o };
      }
    }
    o += width;
  }
  return null;
}

export function useSubtitleLookup({
  lines,
  language,
  pauseOnHover,
  controls,
  scanKey = "none",
  scanDelayMs = 20,
  unknownWords = false,
}: {
  lines: string[];
  language: string;
  pauseOnHover: boolean;
  controls: LookupControls;
  scanKey?: ScanKey;
  // Wait before a hover lookup; only used when no scan key is required.
  scanDelayMs?: number;
  // Open the popup for words no dictionary knows (for the AI explanation).
  unknownWords?: boolean;
}) {
  const [hit, setHit] = useState<LookupHit | null>(null);
  const [result, setResult] = useState<DictLookupResult | null>(null);
  const [pinned, setPinned] = useState(false);
  const pausedByUs = useRef(false);
  const hoverTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const reqId = useRef(0);
  const lastKey = useRef("");
  const controlsRef = useRef(controls);
  controlsRef.current = controls;
  // Last pointer position over the subtitle, so pressing the scan key can
  // look up whatever the cursor is resting on.
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  // Where the pending hover lookup will look.
  const scanAt = useRef({ x: 0, y: 0 });

  const open = !!(hit && result && result.terms.length);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const close = useCallback(() => {
    cancelClose();
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    reqId.current++;
    lastKey.current = "";
    setHit(null);
    setResult(null);
    setPinned(false);
  }, []);

  // `fromPad`: the pointer that left is the controller's, not the mouse.
  const scheduleClose = useCallback(
    (fromPad = false) => {
      cancelClose();
      closeTimer.current = window.setTimeout(close, fromPad ? PAD_CLOSE_GRACE_MS : CLOSE_GRACE_MS);
    },
    [close],
  );

  const runLookup = useCallback(
    (line: number, rawIndex: number) => {
      const text = lines[line] ?? "";
      const index = wordStartIndex(text, rawIndex, language);
      const key = `${line}:${index}:${text}`;
      if (key === lastKey.current) return;
      lastKey.current = key;
      const id = ++reqId.current;
      lookupDictionary(text, index, language)
        .then((found) => {
          if (id !== reqId.current) return;
          let res = found;
          const word = !res.terms.length && unknownWords ? wordAt(text, index) : "";
          if (word && /\p{L}/u.test(word)) res = { terms: [unknownWordTerm(word)], kanji: [] };
          const best = res.terms[0];
          if (!best) {
            setHit(null);
            setResult(null);
            return;
          }
          setHit({ line, start: index, length: codePointsToUtf16(text, index, best.matchLen) });
          setResult(res);
        })
        .catch(() => {
          if (id === reqId.current) {
            setHit(null);
            setResult(null);
          }
        });
    },
    [lines, language, unknownWords],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent | React.MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      pointerRef.current = { x, y };
      scanAt.current = { x, y };
      if (pinned) return;
      cancelClose();
      // The controller pointer (gamepad-runner's synthetic events) has no
      // scan key to hold, and it glides without the small stops a hand makes
      // on a mouse, so waiting for it to rest would only look up once it
      // stops. It scans every interval while it moves instead.
      const fromPad = !e.nativeEvent.isTrusted;
      if (!fromPad && !scanKeyHeld(scanKey, e)) return;
      if (hoverTimer.current) {
        if (fromPad) return;
        window.clearTimeout(hoverTimer.current);
      }
      hoverTimer.current = window.setTimeout(
        () => {
          hoverTimer.current = null;
          const h = hitTestSubtitle(scanAt.current.x, scanAt.current.y);
          if (h) runLookup(h.line, h.index);
        },
        scanKey === "none" || fromPad ? Math.max(0, Math.min(1000, scanDelayMs)) : 0,
      );
    },
    [pinned, runLookup, scanKey, scanDelayMs],
  );

  const onPointerExit = useCallback(() => {
    pointerRef.current = null;
  }, []);

  // With a scan key, pressing it while resting on a word looks that word up.
  useEffect(() => {
    if (scanKey === "none") return;
    const names = SCAN_KEY_NAMES[scanKey];
    const onKey = (e: KeyboardEvent) => {
      const at = pointerRef.current;
      if (!at || pinned || e.repeat || !names.includes(e.key)) return;
      const h = hitTestSubtitle(at.x, at.y);
      if (h) runLookup(h.line, h.index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scanKey, pinned, runLookup]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const h = hitTestSubtitle(e.clientX, e.clientY);
      if (!h) return;
      lastKey.current = "";
      setPinned(false);
      runLookup(h.line, h.index);
    },
    [runLookup],
  );

  // Pause while the popup is open; resume only if we were the ones who paused.
  useEffect(() => {
    const c = controlsRef.current;
    if (open && pauseOnHover && !pausedByUs.current && c.isPlaying()) {
      pausedByUs.current = true;
      c.togglePlay();
    } else if (!open && pausedByUs.current) {
      pausedByUs.current = false;
      if (!c.isPlaying()) c.togglePlay();
    }
  }, [open, pauseOnHover]);

  // A new subtitle line invalidates the highlight.
  const joined = lines.join("\n");
  useEffect(() => {
    if (!pausedByUs.current) close();
  }, [joined, close]);

  useEffect(
    () => () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (pausedByUs.current) {
        pausedByUs.current = false;
        const c = controlsRef.current;
        if (!c.isPlaying()) c.togglePlay();
      }
    },
    [],
  );

  return {
    hit,
    result,
    open,
    // Looks up the word at a position, for picking words without the mouse.
    lookupAt: runLookup,
    pinned,
    setPinned,
    close,
    scheduleClose,
    cancelClose,
    onPointerMove,
    onPointerExit,
    onClick,
  };
}
