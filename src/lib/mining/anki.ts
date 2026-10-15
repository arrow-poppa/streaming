import { invoke } from "@tauri-apps/api/core";
import type { AnkiFieldSource, Settings } from "@/lib/settings";
import type { DictTerm } from "./dictionary";
import { escapeHtml, termGlossaryHtml } from "./glossary-html";
import { audioExtension, findWordAudio, wordAudioDataUrl } from "./local-audio";

export function ankiInvoke<T = unknown>(settings: Settings, action: string, params?: Record<string, unknown>): Promise<T> {
  return invoke<T>("anki_connect", { url: settings.ankiUrl || null, action, params: params ?? null });
}

export const ankiDeckNames = (s: Settings) => ankiInvoke<string[]>(s, "deckNames");
export const ankiModelNames = (s: Settings) => ankiInvoke<string[]>(s, "modelNames");
export const ankiModelFields = (s: Settings, modelName: string) =>
  ankiInvoke<string[]>(s, "modelFieldNames", { modelName });

export const ANKI_FIELD_SOURCES: { id: AnkiFieldSource; label: string }[] = [
  { id: "", label: "(empty)" },
  { id: "expression", label: "Word" },
  { id: "reading", label: "Reading" },
  { id: "furigana", label: "Word with furigana" },
  { id: "glossary", label: "Definitions (all)" },
  { id: "glossary-first", label: "Definition (first dictionary)" },
  { id: "sentence", label: "Sentence (word in bold)" },
  { id: "sentence-cloze", label: "Sentence (word as cloze)" },
  { id: "sentence-audio", label: "Sentence audio" },
  { id: "word-audio", label: "Word audio (local)" },
  { id: "picture", label: "Screenshot" },
  { id: "frequency", label: "Frequency" },
  { id: "pitch", label: "Pitch accent" },
  { id: "title", label: "Title / episode" },
];

// Guess a field mapping from common note type field names (Lapis, JPMN, Kiku, basic).
export function guessFieldMap(fields: string[]): Record<string, AnkiFieldSource> {
  const rules: [RegExp, AnkiFieldSource][] = [
    [/^(expression|word|vocab|front|target ?word)$/i, "expression"],
    [/^(expression ?reading|reading|kana)$/i, "reading"],
    [/furigana/i, "furigana"],
    [/^(main ?definition|definition|meaning|glossary|back)$/i, "glossary"],
    [/^(sentence|context)$/i, "sentence"],
    [/sentence ?audio/i, "sentence-audio"],
    [/^(expression ?audio|word ?audio|audio)$/i, "word-audio"],
    [/^(picture|image|screenshot)$/i, "picture"],
    [/^(frequency|freq)/i, "frequency"],
    [/pitch/i, "pitch"],
    [/^(misc ?info|source|title|notes?)$/i, "title"],
  ];
  const out: Record<string, AnkiFieldSource> = {};
  const used = new Set<AnkiFieldSource>();
  for (const f of fields) {
    const hit = rules.find(([re, src]) => re.test(f.trim()) && !used.has(src));
    if (hit) {
      out[f] = hit[1];
      used.add(hit[1]);
    }
  }
  return out;
}

export type MiningContext = {
  term: DictTerm;
  sentence: string;
  // UTF-16 range of the looked-up word inside `sentence`.
  matchStart: number;
  matchLength: number;
  title: string;
  subStartSec?: number;
  subEndSec?: number;
  mpvEngine: boolean;
};

export function furiganaAnki(term: DictTerm): string {
  if (!term.furigana?.length) return term.reading && term.reading !== term.headword ? `${term.headword}[${term.reading}]` : term.headword;
  return term.furigana
    .map(([text, rt]) => (rt && rt !== text ? ` ${text}[${rt}]` : text))
    .join("")
    .trim();
}

function markedSentence(ctx: MiningContext, cloze: boolean): string {
  const s = ctx.sentence;
  const a = Math.max(0, Math.min(s.length, ctx.matchStart));
  const b = Math.max(a, Math.min(s.length, ctx.matchStart + ctx.matchLength));
  const word = escapeHtml(s.slice(a, b));
  const mid = cloze ? `{{c1::${word}}}` : `<b>${word}</b>`;
  return escapeHtml(s.slice(0, a)) + mid + escapeHtml(s.slice(b));
}

function stamp(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

async function storeMedia(settings: Settings, filename: string, base64: string): Promise<string> {
  return ankiInvoke<string>(settings, "storeMediaFile", { filename, data: base64 });
}

function dataUrlBase64(url: string): string {
  const i = url.indexOf(",");
  return i >= 0 ? url.slice(i + 1) : url;
}

async function fieldValue(settings: Settings, src: AnkiFieldSource, ctx: MiningContext, warn: (m: string) => void): Promise<string> {
  const t = ctx.term;
  switch (src) {
    case "expression":
      return escapeHtml(t.headword);
    case "reading":
      return escapeHtml(t.reading || t.headword);
    case "furigana":
      return escapeHtml(furiganaAnki(t));
    case "glossary":
      return termGlossaryHtml(t);
    case "glossary-first":
      return termGlossaryHtml(t, true);
    case "sentence":
      return markedSentence(ctx, false);
    case "sentence-cloze":
      return markedSentence(ctx, true);
    case "frequency":
      return escapeHtml(t.frequencies.map((f) => `${f.dictionaryName}: ${f.value}`).join(", "));
    case "pitch":
      return escapeHtml(
        t.pitchAccents
          .flatMap((p) => p.pitches.map((x) => `[${x.position}]`))
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(" "),
      );
    case "title":
      return escapeHtml(ctx.title);
    case "picture": {
      if (!ctx.mpvEngine) {
        warn("Screenshot needs the mpv player");
        return "";
      }
      const url = await invoke<string>("mpv_screenshot_data_url");
      const name = await storeMedia(settings, `harbor_${stamp()}.jpg`, dataUrlBase64(url));
      return `<img src="${escapeHtml(name)}">`;
    }
    case "sentence-audio": {
      if (!ctx.mpvEngine) {
        warn("Sentence audio needs the mpv player");
        return "";
      }
      const clip = await invoke<{ dataBase64: string; ext: string }>("mpv_sentence_audio", {
        start: ctx.subStartSec ?? null,
        end: ctx.subEndSec ?? null,
        padBefore: settings.ankiAudioPadSec,
        padAfter: settings.ankiAudioPadSec,
      });
      const name = await storeMedia(settings, `harbor_${stamp()}.${clip.ext}`, clip.dataBase64);
      return `[sound:${name}]`;
    }
    case "word-audio": {
      const entries = await findWordAudio(settings.localAudioDbPath, t.headword, t.reading);
      if (!entries.length) return "";
      const url = await wordAudioDataUrl(settings.localAudioDbPath, entries[0]);
      const name = await storeMedia(settings, `harbor_word_${stamp()}.${audioExtension(entries[0].file)}`, dataUrlBase64(url));
      return `[sound:${name}]`;
    }
    default:
      return "";
  }
}

const MEDIA_SOURCES = new Set<AnkiFieldSource>(["picture", "sentence-audio", "word-audio"]);

export type AddNoteResult = { noteId: number; warnings: string[] };

export async function addNoteFromLookup(settings: Settings, ctx: MiningContext): Promise<AddNoteResult> {
  if (!settings.ankiDeck || !settings.ankiModel) throw new Error("Pick an Anki deck and note type in Settings → Anime");
  const map = settings.ankiFieldMap || {};
  const entries = Object.entries(map).filter(([, src]) => !!src);
  if (!entries.length) throw new Error("Map at least one Anki field in Settings → Anime");

  const tags = settings.ankiTags.split(/[\s,]+/).filter(Boolean);
  const options = { allowDuplicate: settings.ankiAllowDuplicates, duplicateScope: "deck" };

  const warnings: string[] = [];
  const resolve = async (field: string, src: AnkiFieldSource) => {
    try {
      return [field, await fieldValue(settings, src, ctx, (m) => warnings.push(m))] as const;
    } catch (e) {
      warnings.push(`${field}: ${String(e)}`);
      return [field, ""] as const;
    }
  };
  const fields: Record<string, string> = Object.fromEntries(
    await Promise.all(entries.filter(([, src]) => !MEDIA_SOURCES.has(src)).map(([f, src]) => resolve(f, src))),
  );

  // Check for duplicates before capturing media so no media is left orphaned.
  if (!settings.ankiAllowDuplicates) {
    const [ok] = await ankiInvoke<boolean[]>(settings, "canAddNotes", {
      notes: [{ deckName: settings.ankiDeck, modelName: settings.ankiModel, fields, tags, options }],
    });
    if (!ok) throw new Error("Already in your deck (duplicate)");
  }

  for (const [field, value] of await Promise.all(
    entries.filter(([, src]) => MEDIA_SOURCES.has(src)).map(([f, src]) => resolve(f, src)),
  )) {
    fields[field] = value;
  }
  const noteId = await ankiInvoke<number>(settings, "addNote", {
    note: { deckName: settings.ankiDeck, modelName: settings.ankiModel, fields, tags, options },
  });
  return { noteId, warnings };
}
