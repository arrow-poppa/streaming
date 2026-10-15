import { Check, Copy, ExternalLink, Loader2, Plus, RotateCw, Sparkles, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSettings } from "@/lib/settings";
import { addNoteFromLookup, findDuplicateNotes, openNotesInAnki, type MiningContext } from "@/lib/mining/anki";
import {
  aiExplainReady,
  cachedAiExplanation,
  cancelAiExplanation,
  explainWord,
  type AiExplainInput,
} from "@/lib/mining/ai-explain";
import { dictionaryMedia, type DictLookupResult, type DictTerm } from "@/lib/mining/dictionary";
import { glossaryEntryHtml, scopedDictionaryCss } from "@/lib/mining/glossary-html";
import { findWordAudio, playWordAudio, type LocalAudioEntry } from "@/lib/mining/local-audio";

const MAX_TERMS = 8;
// Wait this long before an automatic AI request, so sweeping the mouse
// across a subtitle does not fire one per word.
const AI_AUTO_DELAY_MS = 450;

type PopupMining = Omit<MiningContext, "term" | "aiExplanation" | "popupSelection">;

type Props = {
  result: DictLookupResult;
  anchor: DOMRect;
  mining: PopupMining;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
};

export function LookupPopup({ result, anchor, mining, onEnter, onLeave, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; maxH: number } | null>(null);
  const terms = result.terms.slice(0, MAX_TERMS);
  const { settings } = useSettings();
  const aiInput = useMemo<AiExplainInput | null>(() => {
    const first = terms[0];
    if (!first) return null;
    const surface = mining.sentence.slice(mining.matchStart, mining.matchStart + mining.matchLength) || first.headword;
    return { word: first.headword, surface, sentence: mining.sentence };
  }, [terms, mining.sentence, mining.matchStart, mining.matchLength]);
  const aiOn = aiExplainReady(settings);
  const ai = useAiExplanation(aiOn ? aiInput : null, settings.subLookupAiAuto);
  const termMining = useMemo<Omit<MiningContext, "term">>(
    () => ({ ...mining, aiExplanation: aiOn ? ai.finalText : undefined }),
    [mining, aiOn, ai.finalText],
  );

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
  }, [anchor, result, ai.state]);

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
      className="hb-lookup-popup pointer-events-auto fixed select-text z-[95] w-[min(460px,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-2xl border border-edge-soft bg-elevated/95 text-ink shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
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
        {aiOn && <AiExplanationBox ai={ai} />}
        {terms.map((t, i) => (
          <TermEntry key={`${t.headword}|${t.reading}|${i}`} term={t} mining={termMining} />
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

type AiState = "idle" | "loading" | "streaming" | "done" | "error";

function useAiExplanation(input: AiExplainInput | null, auto: boolean) {
  const { settings } = useSettings();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const key = input ? JSON.stringify(input) : "";
  const [state, setState] = useState<AiState>("idle");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const live = useRef(key);
  live.current = key;

  const generate = useCallback(
    (force = false) => {
      if (!input) return Promise.resolve("");
      const k = key;
      setState("loading");
      setError("");
      return explainWord(settingsRef.current, input, {
        force,
        onText: (t) => {
          if (live.current !== k || !t) return;
          setText(t);
          setState((s) => (s === "loading" ? "streaming" : s));
        },
      })
        .then((t) => {
          if (live.current === k) {
            setText(t);
            setState("done");
          }
          return t;
        })
        .catch((e) => {
          if (live.current === k) {
            setError(String(e?.message ?? e));
            setState("error");
          }
          return "";
        });
    },
    [key],
  );

  useEffect(() => {
    setText("");
    setError("");
    if (!input) {
      setState("idle");
      return;
    }
    const cached = cachedAiExplanation(settingsRef.current, input);
    if (cached) {
      setText(cached);
      setState("done");
      return;
    }
    setState("idle");
    if (!auto) return;
    const t = window.setTimeout(() => void generate(), AI_AUTO_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [key, auto]);

  const cancel = useCallback(() => {
    cancelAiExplanation();
    setState(text ? "done" : "idle");
  }, [text]);

  // Anki export: the finished text, generating it first if needed.
  const finalText = useCallback(() => generate(false), [generate]);

  return { state, text, error, generate, cancel, finalText };
}

function AiExplanationBox({ ai }: { ai: ReturnType<typeof useAiExplanation> }) {
  const busy = ai.state === "loading" || ai.state === "streaming";
  return (
    <div className="flex flex-col gap-1.5 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
          <Sparkles size={12} strokeWidth={2.4} />
          AI explanation
        </span>
        <div className="flex items-center gap-1">
          {busy ? (
            <button
              type="button"
              title="Stop"
              onMouseDown={(e) => e.preventDefault()}
              onClick={ai.cancel}
              className="flex h-6 w-6 items-center justify-center rounded-md text-ink-muted hover:bg-ink/10 hover:text-ink"
            >
              <X size={13} strokeWidth={2.4} />
            </button>
          ) : (
            <button
              type="button"
              title={ai.state === "idle" ? "Explain" : "Explain again"}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void ai.generate(ai.state !== "idle")}
              className="flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-semibold text-ink-muted hover:bg-ink/10 hover:text-ink"
            >
              <RotateCw size={12} strokeWidth={2.4} />
              {ai.state === "idle" ? "Explain" : null}
            </button>
          )}
        </div>
      </div>
      {ai.state === "loading" && (
        <div className="flex items-center gap-2 text-[13px] text-ink-muted">
          <Loader2 size={13} className="animate-spin" />
          Thinking…
        </div>
      )}
      {(ai.state === "streaming" || ai.state === "done") && (
        <div className="whitespace-pre-wrap text-[14px] leading-relaxed">
          <AiText text={ai.text} />
        </div>
      )}
      {ai.state === "error" && <div className="text-[12.5px] text-danger">{ai.error}</div>}
    </div>
  );
}

// Renders **bold** and *italic* from the model's answer; everything else is text.
function AiText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") && p.length > 4 ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : p.startsWith("*") && p.endsWith("*") && p.length > 2 ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          <span key={i}>{p}</span>
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
      {term.synthetic && (
        <div className="text-[12.5px] text-ink-subtle">Not in your dictionaries.</div>
      )}
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
  // Notes already in the deck for this word (Anki's duplicate rule: same
  // first field), plus any added from this popup.
  const [notes, setNotes] = useState<number[]>([]);

  useEffect(() => {
    let alive = true;
    setNotes([]);
    findDuplicateNotes(settings, { ...mining, term })
      .then((ids) => alive && setNotes(ids))
      .catch(() => {});
    return () => {
      alive = false;
    };
    // Re-check only when the word or the deck/note type changes.
  }, [term.headword, term.reading, mining.sentence, settings.ankiDeck, settings.ankiModel, settings.ankiUrl]);

  const duplicate = notes.length > 0 && state !== "done";
  const blocked = duplicate && !settings.ankiAllowDuplicates;

  const add = async () => {
    if (state === "busy") return;
    if (blocked) {
      void openNotesInAnki(settings, notes).catch((e) => {
        setState("error");
        setMsg(String(e).replace(/^Error:\s*/, ""));
      });
      return;
    }
    setState("busy");
    setMsg("Adding…");
    try {
      const res = await addNoteFromLookup(settings, { ...mining, term, popupSelection: selectionInPopup() });
      setState("done");
      setNotes((n) => [...n, res.noteId]);
      setMsg(res.warnings.length ? `Added, with issues: ${res.warnings.join("; ")}` : "Added to Anki");
    } catch (e) {
      setState("error");
      setMsg(String(e).replace(/^Error:\s*/, ""));
    }
  };

  const title =
    state === "idle" && duplicate
      ? blocked
        ? `Already in your deck (${notes.length}). Click to open it in Anki.`
        : `Already in your deck (${notes.length}). Click to add another card.`
      : msg;

  return (
    <div className="flex items-center gap-1">
      {notes.length > 0 && (
        <button
          type="button"
          title={notes.length > 1 ? `Open the ${notes.length} notes in Anki` : "Open the note in Anki"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => void openNotesInAnki(settings, notes).catch(() => {})}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge-soft text-ink-muted transition-colors hover:border-edge hover:text-ink"
        >
          <ExternalLink size={14} strokeWidth={2.2} />
        </button>
      )}
      <button
        type="button"
        // Keep a text selection made in the popup: it can be exported to Anki.
        onMouseDown={(e) => e.preventDefault()}
        onClick={add}
        title={title}
        className={`flex h-8 items-center gap-1 rounded-lg px-2.5 text-[12px] font-semibold transition-colors ${
          state === "done"
            ? "bg-success/20 text-success"
            : state === "error"
              ? "bg-danger/15 text-danger"
              : duplicate
                ? "bg-amber-300/20 text-amber-300 hover:bg-amber-300/30"
                : "bg-ink text-canvas hover:opacity-90"
        }`}
      >
        {state === "busy" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : state === "done" ? (
          <Check size={14} strokeWidth={2.6} />
        ) : duplicate ? (
          <Copy size={14} strokeWidth={2.4} />
        ) : (
          <Plus size={14} strokeWidth={2.6} />
        )}
        Anki
      </button>
    </div>
  );
}

function selectionInPopup(): string {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return "";
  const node = sel.anchorNode;
  const el = node && (node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement);
  if (!el?.closest(".hb-lookup-popup")) return "";
  return sel.toString().trim();
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
