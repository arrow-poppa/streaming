import { useCallback, useEffect, useRef, useState } from "react";
import { codePointsToUtf16, lookupDictionary, type DictLookupResult } from "@/lib/mining/dictionary";

export type LookupControls = {
  isPlaying: () => boolean;
  togglePlay: () => void;
  // Hides/shows the subtitles mpv draws itself (ASS/native mode).
  setNativeSubVisible: (on: boolean) => void;
  title: string;
  mpvEngine: boolean;
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

const HOVER_DELAY_MS = 70;
const CLOSE_GRACE_MS = 280;

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
}: {
  lines: string[];
  language: string;
  pauseOnHover: boolean;
  controls: LookupControls;
  scanKey?: ScanKey;
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

  const open = !!(hit && result && result.terms.length);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const close = useCallback(() => {
    cancelClose();
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    reqId.current++;
    lastKey.current = "";
    setHit(null);
    setResult(null);
    setPinned(false);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(close, CLOSE_GRACE_MS);
  }, [close]);

  const runLookup = useCallback(
    (line: number, rawIndex: number) => {
      const text = lines[line] ?? "";
      const index = wordStartIndex(text, rawIndex, language);
      const key = `${line}:${index}:${text}`;
      if (key === lastKey.current) return;
      lastKey.current = key;
      const id = ++reqId.current;
      lookupDictionary(text, index, language)
        .then((res) => {
          if (id !== reqId.current) return;
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
    [lines, language],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent | React.MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      pointerRef.current = { x, y };
      if (pinned) return;
      cancelClose();
      if (!scanKeyHeld(scanKey, e)) return;
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      hoverTimer.current = window.setTimeout(() => {
        const h = hitTestSubtitle(x, y);
        if (h) runLookup(h.line, h.index);
      }, HOVER_DELAY_MS);
    },
    [pinned, runLookup, scanKey],
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
