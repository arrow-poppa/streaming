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

const HOVER_DELAY_MS = 70;
const CLOSE_GRACE_MS = 280;

// Maps a pointer position to a UTF-16 offset inside one rendered subtitle line.
// Text spans carry data-hb-line / data-hb-off (offset of their first character).
export function hitTestSubtitle(x: number, y: number): { line: number; index: number } | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  let node: Node | null = null;
  let offset = 0;
  if (doc.caretPositionFromPoint) {
    const p = doc.caretPositionFromPoint(x, y);
    node = p?.offsetNode ?? null;
    offset = p?.offset ?? 0;
  } else if (doc.caretRangeFromPoint) {
    const r = doc.caretRangeFromPoint(x, y);
    node = r?.startContainer ?? null;
    offset = r?.startOffset ?? 0;
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) return null;
  const span = node.parentElement?.closest<HTMLElement>("[data-hb-off]");
  if (!span) return null;
  const text = node.textContent ?? "";
  const range = document.createRange();
  // The caret lands after a character when the pointer is on its right half.
  for (const o of [offset, offset - 1]) {
    if (o < 0 || o >= text.length) continue;
    const c = text.charCodeAt(o);
    if (c >= 0xdc00 && c <= 0xdfff) continue;
    const end = c >= 0xd800 && c <= 0xdbff ? Math.min(text.length, o + 2) : o + 1;
    range.setStart(node, o);
    range.setEnd(node, end);
    for (const rect of Array.from(range.getClientRects())) {
      if (x >= rect.left - 1 && x <= rect.right + 1 && y >= rect.top - 1 && y <= rect.bottom + 1) {
        if (/\s/.test(text[o])) return null;
        return { line: Number(span.dataset.hbLine), index: Number(span.dataset.hbOff) + o };
      }
    }
  }
  return null;
}

export function useSubtitleLookup({
  lines,
  language,
  pauseOnHover,
  controls,
}: {
  lines: string[];
  language: string;
  pauseOnHover: boolean;
  controls: LookupControls;
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
    (line: number, index: number) => {
      const text = lines[line] ?? "";
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
      if (pinned) return;
      cancelClose();
      const x = e.clientX;
      const y = e.clientY;
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      hoverTimer.current = window.setTimeout(() => {
        const h = hitTestSubtitle(x, y);
        if (h) runLookup(h.line, h.index);
      }, HOVER_DELAY_MS);
    },
    [pinned, runLookup],
  );

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
    onClick,
  };
}
