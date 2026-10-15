import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "@/lib/settings";
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
};

export function InteractiveSubtitle({ lines, textStyle, boxStyle, controls, startSec, endSec, native }: Props) {
  const { settings } = useSettings();
  const lookup = useSubtitleLookup({
    lines,
    language: settings.subLookupLanguage || "japanese",
    pauseOnHover: settings.subLookupPauseOnHover,
    controls,
    scanKey: settings.subLookupScanKey ?? "none",
  });
  const markRef = useRef<HTMLSpanElement>(null);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [hovering, setHovering] = useState(false);
  const revealed = !native || hovering || lookup.open;

  useLayoutEffect(() => {
    setAnchor(lookup.open && markRef.current ? markRef.current.getBoundingClientRect() : null);
  }, [lookup.open, lookup.hit]);

  // Swap mpv's own subtitle for this copy while it is revealed.
  const controlsRef = useRef(controls);
  controlsRef.current = controls;
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
      mpvEngine: controls.mpvEngine,
    };
  }, [lines, lookup.hit, controls.title, controls.mpvEngine, startSec, endSec]);

  const hiddenText: React.CSSProperties = { color: "transparent", textShadow: "none" };
  return (
    <div
      className="pointer-events-auto max-w-[80%] cursor-text"
      style={revealed ? boxStyle : undefined}
      onPointerEnter={() => {
        lookup.cancelClose();
        setHovering(true);
      }}
      onPointerLeave={() => {
        setHovering(false);
        lookup.onPointerExit();
        if (!lookup.pinned) lookup.scheduleClose();
      }}
      onPointerMove={lookup.onPointerMove}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={lookup.onClick}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div style={revealed ? textStyle : { ...textStyle, ...hiddenText }}>
        {lines.map((line, i) => (
          <Line key={i} index={i} text={line} hit={lookup.hit} markRef={markRef} visible={revealed} />
        ))}
      </div>
      {lookup.open && anchor && lookup.result && (
        <LookupPopup
          result={lookup.result}
          anchor={anchor}
          mining={mining}
          onEnter={() => {
            lookup.cancelClose();
            lookup.setPinned(true);
          }}
          onLeave={() => {
            lookup.setPinned(false);
            lookup.scheduleClose();
          }}
          onClose={lookup.close}
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
