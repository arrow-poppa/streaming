import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "@/lib/settings";
import { aiExplainReady, explainWord } from "@/lib/mining/ai-explain";
import { setWordSelection } from "@/lib/player/word-selection";
import {
  firstWord,
  nextWord,
  onLookupCommand,
  prevWord,
  setLookupNavActive,
  setLookupPopupOpen,
  wordLength,
  wordOnOtherLine,
  type WordPos,
} from "@/lib/player/lookup-nav";
import { LookupPopup } from "./lookup-popup";
import { useSubtitleLookup, type LookupControls, type LookupHit } from "./use-subtitle-lookup";

// Scripts written without spaces between words (CJK, kana, Thai, Lao, Khmer).
const NO_SPACE_CHAR = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\u3000-\u303f\uff00-\uffef]/u;

// Separator used when a subtitle's lines are joined into one sentence: none
// between two no-space scripts, a space otherwise. Decided from the text
// itself, so an English line is never glued even if the lookup language is
// still set to Japanese.
export function lineSeparator(prev: string, next: string): string {
  const a = prev.trimEnd().slice(-1);
  const b = next.trimStart().charAt(0);
  if (!a || !b) return "";
  return NO_SPACE_CHAR.test(a) && NO_SPACE_CHAR.test(b) ? "" : " ";
}

type Props = {
  lines: string[];
  textStyle: React.CSSProperties;
  boxStyle?: React.CSSProperties;
  controls: LookupControls;
  startSec: number;
  endSec?: number;
  // ASS/native mode: mpv draws the subtitle; this copy stays invisible until
  // hovered, then replaces mpv's rendering while the user reads/looks up.
  native: boolean;
  // Subtitles hidden by the user: invisible and not hoverable, shown only
  // while a word is picked from them with the keyboard or a controller.
  concealed?: boolean;
};

export function InteractiveSubtitle({
  lines,
  textStyle,
  boxStyle,
  controls,
  startSec,
  endSec,
  native,
  concealed = false,
}: Props) {
  const { settings } = useSettings();
  const lookup = useSubtitleLookup({
    lines,
    language: settings.subLookupLanguage || "japanese",
    pauseOnHover: settings.subLookupPauseOnHover,
    controls,
    scanKey: settings.subLookupScanKey ?? "none",
    scanDelayMs: settings.subLookupScanDelayMs ?? 20,
    unknownWords: settings.subLookupAiUnknown && aiExplainReady(settings),
  });
  const markRef = useRef<HTMLSpanElement>(null);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [hovering, setHovering] = useState(false);
  const stayOpen = settings.subLookupStayOpen;
  const rootRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  // Picking words with the keyboard or a controller (see lookup-nav). The
  // position is kept apart from the dictionary hit: a word no dictionary
  // knows still gets highlighted, and the next step starts from it.
  const navRef = useRef<{ pos: WordPos; history: WordPos[]; pausedByNav: boolean } | null>(null);
  const [navPos, setNavPos] = useState<WordPos | null>(null);
  // In the mode the dictionary is still queried on every step (its match is
  // how far a Japanese word reaches), but the popup only shows on request.
  const [navPopup, setNavPopup] = useState(false);
  const hitRef = useRef(lookup.hit);
  hitRef.current = lookup.hit;
  const popupShownRef = useRef(false);
  const lookupAt = lookup.lookupAt;
  const plainClose = lookup.close;
  const setPinned = lookup.setPinned;

  const exitNav = useCallback(() => {
    const nav = navRef.current;
    navRef.current = null;
    setNavPos(null);
    setNavPopup(false);
    setLookupNavActive(false);
    plainClose();
    const c = controlsRef.current;
    if (nav?.pausedByNav && !c.isPlaying()) c.togglePlay();
  }, [plainClose]);

  // Hiding the subtitles takes an open popup with them (not one opened from
  // the pick-a-word mode, which shows the line on purpose).
  useEffect(() => {
    if (concealed && !navRef.current) plainClose();
  }, [concealed, plainClose]);

  // In the mode, closing the popup (Escape, a click outside) only hides it;
  // leaving the mode is its own key.
  const closeLookup = useCallback(() => (navRef.current ? setNavPopup(false) : plainClose()), [plainClose]);

  useEffect(() => {
    const goTo = (pos: WordPos) => {
      if (!navRef.current) return;
      navRef.current.pos = pos;
      setNavPos(pos);
      setNavPopup(false);
      lookupAt(pos.line, pos.index);
      setPinned(true);
    };
    return onLookupCommand((cmd) => {
      const nav = navRef.current;
      if (cmd === "toggle") {
        if (nav) {
          exitNav();
          return true;
        }
        const start = firstWord(lines);
        if (!start) return false;
        const c = controlsRef.current;
        const wasPlaying = c.isPlaying();
        if (wasPlaying) c.togglePlay();
        navRef.current = { pos: start, history: [], pausedByNav: wasPlaying };
        setLookupNavActive(true);
        goTo(start);
        return true;
      }
      if (!nav) {
        // Outside the mode, the leave key closes a popup the mouse or the
        // controller pointer opened.
        if (cmd !== "exit" || !popupShownRef.current) return false;
        plainClose();
        return true;
      }
      if (cmd === "exit") {
        exitNav();
        return true;
      }
      if (cmd === "popup") {
        setNavPopup((open) => !open);
        return true;
      }
      if (cmd === "nextWord") {
        // How far the dictionary match reaches: a Japanese word ends there.
        const hit = hitRef.current;
        const matched = hit && hit.line === nav.pos.line && hit.start >= nav.pos.index ? hit.start + hit.length - nav.pos.index : 0;
        const next = nextWord(lines, nav.pos, matched);
        if (next) {
          nav.history.push(nav.pos);
          goTo(next);
        }
        return true;
      }
      if (cmd === "prevWord") {
        const prev = nav.history.pop() ?? prevWord(lines, nav.pos);
        if (prev) goTo(prev);
        return true;
      }
      if (cmd === "prevLine" || cmd === "nextLine") {
        const other = wordOnOtherLine(lines, nav.pos, cmd === "nextLine" ? 1 : -1);
        if (other) {
          nav.history = [];
          goTo(other);
        }
        return true;
      }
      return false;
    });
  }, [lines, lookupAt, setPinned, exitNav, plainClose]);

  useEffect(
    () => () => {
      if (navRef.current) setLookupNavActive(false);
    },
    [],
  );

  const navHit =
    navPos && lines[navPos.line] != null
      ? { line: navPos.line, start: navPos.index, length: wordLength(lines[navPos.line], navPos.index) }
      : null;
  const shownHit = lookup.hit ?? navHit;
  const revealed = concealed ? !!navPos : !native || hovering || lookup.open || !!navPos;
  const popupShown = lookup.open && (!navPos || navPopup);
  popupShownRef.current = popupShown;

  // With "keep open", the first click outside the subtitle and the popup only
  // dismisses it; that click is swallowed so it does not also toggle playback.
  useEffect(() => {
    if (!stayOpen || !popupShown) return;
    const inside = (target: EventTarget | null) =>
      target instanceof Element &&
      (!!target.closest(".hb-lookup-popup") || !!rootRef.current?.contains(target));
    const onDown = (e: PointerEvent) => {
      if (inside(e.target)) return;
      e.stopPropagation();
      // Closing unmounts this effect before the matching mousedown/click
      // arrive, so they are swallowed by listeners that outlive it.
      const swallow = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (ev.type === "click") done();
      };
      const done = () => {
        window.removeEventListener("mousedown", swallow, true);
        window.removeEventListener("click", swallow, true);
        window.clearTimeout(timer);
      };
      // A drag that ends elsewhere fires no click; stop waiting for it.
      const timer = window.setTimeout(done, 1000);
      window.addEventListener("mousedown", swallow, true);
      window.addEventListener("click", swallow, true);
      closeLookup();
    };
    window.addEventListener("pointerdown", onDown, true);
    return () => window.removeEventListener("pointerdown", onDown, true);
  }, [stayOpen, popupShown, closeLookup]);

  useLayoutEffect(() => {
    setAnchor(popupShown && markRef.current ? markRef.current.getBoundingClientRect() : null);
  }, [popupShown, lookup.hit]);

  // Swap mpv's own subtitle for this copy while it is revealed.
  useEffect(() => {
    if (!native) return;
    controlsRef.current.setNativeSubVisible(!revealed);
  }, [native, revealed]);
  useEffect(
    () => () => {
      if (native) controlsRef.current.setNativeSubVisible(true);
    },
    [native],
  );

  const mining = useMemo(() => {
    const hit = lookup.hit;
    let sentence = "";
    let matchStart = 0;
    lines.forEach((line, i) => {
      if (i > 0) sentence += lineSeparator(lines[i - 1], line);
      if (hit && hit.line === i) matchStart = sentence.length + hit.start;
      sentence += line;
    });
    return {
      sentence,
      matchStart,
      matchLength: hit?.length ?? 0,
      title: controls.title,
      subStartSec: startSec,
      subEndSec: endSec,
      subDelaySec: controls.subDelaySec,
      mpvEngine: controls.mpvEngine,
    };
  }, [lines, lookup.hit, controls.title, controls.mpvEngine, controls.subDelaySec, startSec, endSec]);

  // A word highlighted in the pick-a-word mode, or shown in the popup, is the
  // selected word the immersion card hotkeys add to the card.
  const owner = useRef({}).current;
  const aiOn = settings.subLookupAiEnabled && aiExplainReady(settings);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const selectedTerm = (navPos || popupShown) && lookup.hit ? lookup.result?.terms[0] : undefined;
  const selectedTarget = selectedTerm ? lookup.result?.word || selectedTerm.headword : "";
  useEffect(() => {
    if (!selectedTerm) {
      setWordSelection(owner, null);
      return;
    }
    const input = { target: selectedTarget, sentence: mining.sentence };
    setWordSelection(owner, {
      term: selectedTerm,
      sentence: mining.sentence,
      matchStart: mining.matchStart,
      matchLength: mining.matchLength,
      // Joins the popup's request or its cached answer when there is one.
      aiExplanation: aiOn ? () => explainWord(settingsRef.current, input).catch(() => "") : undefined,
    });
  }, [owner, selectedTerm, selectedTarget, mining, aiOn]);
  useEffect(() => () => setWordSelection(owner, null), [owner]);
  useEffect(() => {
    setLookupPopupOpen(owner, popupShown);
    return () => setLookupPopupOpen(owner, false);
  }, [owner, popupShown]);

  const hiddenText: React.CSSProperties = { color: "transparent", textShadow: "none" };
  return (
    <div
      ref={rootRef}
      data-hb-subtitle
      className={`${concealed && !navPos ? "pointer-events-none" : "pointer-events-auto"} max-w-[80%] cursor-text`}
      style={revealed ? boxStyle : undefined}
      onPointerEnter={() => {
        lookup.cancelClose();
        setHovering(true);
      }}
      onPointerLeave={(e) => {
        setHovering(false);
        lookup.onPointerExit();
        if (!lookup.pinned && !stayOpen && !navRef.current) lookup.scheduleClose(!e.nativeEvent.isTrusted);
      }}
      onPointerMove={lookup.onPointerMove}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={lookup.onClick}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div style={revealed ? textStyle : { ...textStyle, ...hiddenText }}>
        {lines.map((line, i) => (
          <Line key={i} index={i} text={line} hit={shownHit} markRef={markRef} visible={revealed} />
        ))}
      </div>
      {popupShown && anchor && lookup.result && (
        <LookupPopup
          result={lookup.result}
          anchor={anchor}
          mining={mining}
          onEnter={() => {
            lookup.cancelClose();
            lookup.setPinned(true);
          }}
          onLeave={(fromPad) => {
            if (navRef.current) return;
            lookup.setPinned(false);
            if (!stayOpen) lookup.scheduleClose(fromPad);
          }}
        />
      )}
    </div>
  );
}

function Line({
  index,
  text,
  hit,
  markRef,
  visible,
}: {
  index: number;
  text: string;
  hit: LookupHit | null;
  markRef: React.RefObject<HTMLSpanElement | null>;
  visible: boolean;
}) {
  if (!hit || hit.line !== index) {
    return (
      <div>
        <span data-hb-line={index} data-hb-off={0}>
          {text}
        </span>
      </div>
    );
  }
  const a = hit.start;
  const b = Math.min(text.length, hit.start + hit.length);
  return (
    <div>
      {a > 0 && (
        <span data-hb-line={index} data-hb-off={0}>
          {text.slice(0, a)}
        </span>
      )}
      <span
        ref={markRef}
        data-hb-line={index}
        data-hb-off={a}
        className="rounded-[0.18em]"
        style={visible ? { background: "color-mix(in srgb, var(--color-accent) 42%, transparent)" } : undefined}
      >
        {text.slice(a, b)}
      </span>
      {b < text.length && (
        <span data-hb-line={index} data-hb-off={b}>
          {text.slice(b)}
        </span>
      )}
    </div>
  );
}
