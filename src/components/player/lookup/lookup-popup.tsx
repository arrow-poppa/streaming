import { Check, Loader2, Plus, Volume2 } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSettings } from "@/lib/settings";
import { addNoteFromLookup, type MiningContext } from "@/lib/mining/anki";
import { dictionaryMedia, type DictLookupResult, type DictTerm } from "@/lib/mining/dictionary";
import { glossaryEntryHtml, scopedDictionaryCss } from "@/lib/mining/glossary-html";
import { findWordAudio, playWordAudio, type LocalAudioEntry } from "@/lib/mining/local-audio";

const MAX_TERMS = 8;

type Props = {
  result: DictLookupResult;
  anchor: DOMRect;
  mining: Omit<MiningContext, "term">;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
};

export function LookupPopup({ result, anchor, mining, onEnter, onLeave, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; maxH: number } | null>(null);
  const terms = result.terms.slice(0, MAX_TERMS);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el.offsetWidth;
    const gap = 10;
    const above = anchor.top - gap;
    const below = vh - anchor.bottom - gap;
    const placeAbove = above >= Math.min(320, below) || above > below;
    const maxH = Math.max(160, Math.min(vh * 0.62, (placeAbove ? above : below) - 12));
    const h = Math.min(el.scrollHeight, maxH);
    const left = Math.max(12, Math.min(vw - w - 12, anchor.left + anchor.width / 2 - w / 2));
    const top = placeAbove ? Math.max(12, anchor.top - gap - h) : anchor.bottom + gap;
    setPos({ left, top, maxH });
  }, [anchor, result]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const css = useMemo(() => {
    const byDict = new Map<string, string>();
    for (const t of terms) for (const [d, s] of Object.entries(t.styles ?? {})) if (s) byDict.set(d, s);
    return Array.from(byDict, ([d, s]) => scopedDictionaryCss(d, s)).join("\n");
  }, [terms]);

  const host = document.querySelector("[data-harbor-player]") ?? document.body;
  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label="Dictionary"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className="hb-lookup-popup pointer-events-auto fixed z-[95] w-[min(460px,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-2xl border border-edge-soft bg-elevated/95 text-ink shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
      style={{
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        maxHeight: pos?.maxH ?? "60vh",
        visibility: pos ? "visible" : "hidden",
      }}
    >
      {css && <style>{css}</style>}
      <style>{POPUP_CSS}</style>
      <div className="flex flex-col divide-y divide-edge-soft">
        {terms.map((t, i) => (
          <TermEntry key={`${t.headword}|${t.reading}|${i}`} term={t} mining={mining} />
        ))}
      </div>
    </div>,
    host,
  );
}

function Furigana({ term }: { term: DictTerm }) {
  if (!term.furigana?.length) return <>{term.headword}</>;
  return (
    <>
      {term.furigana.map(([text, rt], i) =>
        rt && rt !== text ? (
          <ruby key={i}>
            {text}
            <rt>{rt}</rt>
          </ruby>
        ) : (
          <span key={i}>{text}</span>
        ),
      )}
    </>
  );
}

function TermEntry({ term, mining }: { term: DictTerm; mining: Omit<MiningContext, "term"> }) {
  const { settings } = useSettings();
  const pitches = useMemo(
    () =>
      Array.from(new Set(term.pitchAccents.flatMap((p) => p.pitches.map((x) => x.position)))).slice(0, 4),
    [term],
  );
  const freqs = term.frequencies.slice(0, 4);

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span lang="ja" className="text-[26px] font-semibold leading-[1.35] tracking-tight">
            <Furigana term={term} />
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {pitches.map((p) => (
              <span key={p} className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[11px] font-semibold text-accent">
                [{p}]
              </span>
            ))}
            {term.termTags.slice(0, 5).map((t) => (
              <span
                key={t.name}
                title={t.description || undefined}
                className="rounded-md bg-ink/10 px-1.5 py-0.5 text-[11px] font-medium text-ink-muted"
              >
                {t.name}
              </span>
            ))}
            {freqs.map((f, i) => (
              <span
                key={`${f.dictionaryName}${i}`}
                title={f.dictionaryName}
                className="rounded-md border border-edge-soft px-1.5 py-0.5 text-[11px] text-ink-subtle"
              >
                {shortDict(f.dictionaryName)} {f.value}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pt-1">
          {settings.localAudioDbPath && <WordAudioButton term={term} dbPath={settings.localAudioDbPath} />}
          <AnkiButton term={term} mining={mining} />
        </div>
      </div>
      {term.glossary.map((g, i) => (
        <GlossaryBlock key={`${g.dictionaryName}${i}`} dictionary={g.dictionaryName} tags={g.tags} content={g.content} />
      ))}
    </div>
  );
}

function shortDict(name: string): string {
  return name.replace(/\s*\[.*?\]\s*/g, "").slice(0, 14);
}

function GlossaryBlock({ dictionary, tags, content }: { dictionary: string; tags: string[]; content: unknown[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => glossaryEntryHtml(content, { images: true, dictionary }), [content, dictionary]);

  useEffect(() => {
    const imgs = ref.current?.querySelectorAll<HTMLImageElement>("img[data-hb-path]") ?? [];
    let alive = true;
    imgs.forEach((img) => {
      const d = img.dataset.hbDict ?? dictionary;
      const p = img.dataset.hbPath ?? "";
      dictionaryMedia(d, p)
        .then((url) => {
          if (alive) img.src = url;
        })
        .catch(() => img.remove());
    });
    return () => {
      alive = false;
    };
  }, [html, dictionary]);

  const posTags = tags.filter((t) => !/^\d+$/.test(t));
  return (
    <div className="hb-dict-entry text-[14px] leading-relaxed" data-dictionary={dictionary}>
      <div className="mb-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-subtle">
        <span className="font-semibold uppercase tracking-[0.08em]">{shortDict(dictionary)}</span>
        {posTags.map((t) => (
          <span key={t} className="rounded bg-ink/10 px-1 text-ink-muted">
            {t}
          </span>
        ))}
      </div>
      <div ref={ref} className="hb-gloss" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function WordAudioButton({ term, dbPath }: { term: DictTerm; dbPath: string }) {
  const [entries, setEntries] = useState<LocalAudioEntry[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    findWordAudio(dbPath, term.headword, term.reading)
      .then((e) => alive && setEntries(e))
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, [dbPath, term.headword, term.reading]);

  const none = entries !== null && entries.length === 0;
  const current = entries?.[idx];
  return (
    <button
      type="button"
      disabled={!current}
      title={err ?? (none ? "No local audio for this word" : current ? `${current.label} — click again for the next voice` : "")}
      onClick={() => {
        if (!entries?.length) return;
        const entry = entries[idx];
        playWordAudio(dbPath, entry).catch((e) => setErr(String(e)));
        setIdx((i) => (i + 1) % entries.length);
      }}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge-soft text-ink-muted transition-colors hover:border-edge hover:text-ink disabled:opacity-35"
    >
      <Volume2 size={15} strokeWidth={2.2} />
    </button>
  );
}

function AnkiButton({ term, mining }: { term: DictTerm; mining: Omit<MiningContext, "term"> }) {
  const { settings } = useSettings();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("Add to Anki");

  const add = async () => {
    if (state === "busy") return;
    setState("busy");
    setMsg("Adding…");
    try {
      const res = await addNoteFromLookup(settings, { ...mining, term });
      setState("done");
      setMsg(res.warnings.length ? `Added, with issues: ${res.warnings.join("; ")}` : "Added to Anki");
    } catch (e) {
      setState("error");
      setMsg(String(e).replace(/^Error:\s*/, ""));
    }
  };

  return (
    <button
      type="button"
      onClick={add}
      title={msg}
      className={`flex h-8 items-center gap-1 rounded-lg px-2.5 text-[12px] font-semibold transition-colors ${
        state === "done"
          ? "bg-success/20 text-success"
          : state === "error"
            ? "bg-danger/15 text-danger"
            : "bg-ink text-canvas hover:opacity-90"
      }`}
    >
      {state === "busy" ? (
        <Loader2 size={14} className="animate-spin" />
      ) : state === "done" ? (
        <Check size={14} strokeWidth={2.6} />
      ) : (
        <Plus size={14} strokeWidth={2.6} />
      )}
      Anki
    </button>
  );
}

const POPUP_CSS = `
.hb-lookup-popup rt { font-size: 0.42em; font-weight: 500; opacity: 0.8; }
.hb-gloss ul, .hb-gloss ol { padding-inline-start: 1.25em; margin: 0.15em 0; }
.hb-gloss ul { list-style: disc; }
.hb-gloss ol { list-style: decimal; }
.hb-gloss table { border-collapse: collapse; margin: 0.25em 0; }
.hb-gloss td, .hb-gloss th { border: 1px solid var(--color-edge-soft); padding: 0.1em 0.35em; }
.hb-gloss .hb-dict-img { display: inline-block; max-width: 100%; vertical-align: middle; }
.hb-gloss .hb-dict-link { text-decoration: underline; text-underline-offset: 2px; }
.hb-gloss details > summary { cursor: pointer; color: var(--color-ink-muted); }
`;
