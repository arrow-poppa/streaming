import { invoke } from "@tauri-apps/api/core";
import type { AnkiFieldSource, Settings } from "@/lib/settings";
import {
  addNoteFromLookup,
  ankiInvoke,
  ankiModelFields,
  dataUrlBase64,
  noteFieldsFromLookup,
  stamp,
  storeMedia,
  type MiningContext,
} from "./anki";
import { locateWord, type WordSelection } from "@/lib/player/word-selection";
import { escapeHtml } from "./glossary-html";
import { invisibleMarker, newestRecentNote } from "./immersion-core";

export { lineFromSnapshot, pushLine } from "./immersion-core";

// Cards made straight from the player: from the subtitle line on screen, or
// from a stretch recorded between two presses. Sentence cards use the deck,
// note type and field map of the dictionary cards. With a word selected in
// the subtitles every mapped field is filled, as the popup's Anki button
// does; without one only what exists without a word (sentence, its audio,
// the picture or clip, the title). Audio cards have their own deck and fields.

export type ImmersionTarget = "new" | "update" | "audio";

export type ImmersionClip = {
  /** Subtitle text; lines of a recording are joined with "\n". May be "". */
  sentence: string;
  start: number;
  end: number;
  /** Padding around a subtitle line; a recording is cut exactly. */
  pad: number;
  recorded?: boolean;
};

export type ImmersionResult = { noteId: number; deck: string; warnings: string[]; word?: string };

async function recentNote(settings: Settings, deck: string): Promise<number> {
  // Deck first: a bare `added:1` would pick a card mined into another deck today.
  const ids = await ankiInvoke<number[]>(settings, "findNotes", {
    query: `"deck:${deck.replace(/[\\"*_]/g, (c) => `\\${c}`)}" added:1`,
  });
  const windowMin = settings.immersionUpdateWindowMin || 10;
  const noteId = newestRecentNote(ids ?? [], Date.now(), windowMin);
  if (noteId == null) throw new Error(`No card added to ${deck} in the last ${windowMin} minutes`);
  return noteId;
}

/** Only filled fields: sending "" would wipe what the card already has,
 *  such as a translation typed by hand. */
async function fillNote(settings: Settings, noteId: number, fields: Record<string, string>): Promise<void> {
  const filled = Object.fromEntries(Object.entries(fields).filter(([, v]) => v));
  await ankiInvoke(settings, "updateNoteFields", { note: { id: noteId, fields: filled } });
}

async function exportWithWord(
  settings: Settings,
  target: "new" | "update",
  clip: ImmersionClip,
  title: string,
  selection: WordSelection,
): Promise<ImmersionResult> {
  if (!settings.ankiDeck || !settings.ankiModel) {
    throw new Error("Pick an Anki deck and note type in Settings → Dictionary & Anki");
  }
  // A recording's text joins every line it crossed; the word is looked for in it.
  const sentence = clip.recorded ? clip.sentence : selection.sentence;
  const place = clip.recorded ? locateWord(selection, sentence) : selection;
  const ctx: MiningContext = {
    term: selection.term,
    sentence,
    matchStart: place.matchStart,
    matchLength: place.matchLength,
    title,
    mpvEngine: true,
    aiExplanation: selection.aiExplanation,
    audioRange: { start: clip.start, end: clip.end, pad: clip.pad },
  };
  const word = selection.term.headword;
  if (target === "new") {
    const res = await addNoteFromLookup(settings, ctx);
    return { noteId: res.noteId, deck: settings.ankiDeck, warnings: res.warnings, word };
  }
  const noteId = await recentNote(settings, settings.ankiDeck);
  const { fields, warnings } = await noteFieldsFromLookup(settings, ctx);
  await fillNote(settings, noteId, fields);
  return { noteId, deck: settings.ankiDeck, warnings, word };
}

const SENTENCE_SOURCES = new Set<AnkiFieldSource>(["sentence", "sentence-plain", "sentence-cloze"]);

function sentenceHtml(sentence: string): string {
  return escapeHtml(sentence).replace(/\r?\n/g, "<br>");
}

async function sentenceAudio(settings: Settings, clip: ImmersionClip): Promise<string> {
  const audio = await invoke<{ dataBase64: string; ext: string }>("mpv_sentence_audio", {
    start: clip.start,
    end: clip.end,
    padBefore: clip.pad,
    padAfter: clip.pad,
  });
  const name = await storeMedia(settings, `harbor_${stamp()}.${audio.ext}`, audio.dataBase64);
  return `[sound:${name}]`;
}

async function picture(settings: Settings): Promise<string> {
  const url = await invoke<string>("mpv_screenshot_data_url");
  const name = await storeMedia(settings, `harbor_${stamp()}.jpg`, dataUrlBase64(url));
  return `<img src="${escapeHtml(name)}">`;
}

async function animatedClip(
  settings: Settings,
  clip: ImmersionClip,
  warn: (m: string) => void,
): Promise<string> {
  const format = settings.ankiClipFormat || "avif";
  const out = await invoke<{ dataBase64: string; ext: string; format: string }>(
    "mpv_sentence_clip",
    {
      start: clip.start,
      end: clip.end,
      padBefore: clip.pad,
      padAfter: clip.pad,
      format,
      width: settings.ankiClipWidth || 480,
      fps: settings.ankiClipFps || 12,
    },
  );
  if (out.format !== format)
    warn(`Clip saved as ${out.format.toUpperCase()} (no ${format} encoder)`);
  const name = await storeMedia(settings, `harbor_clip_${stamp()}.${out.ext}`, out.dataBase64);
  return `<img src="${escapeHtml(name)}">`;
}

type Profile = { deck: string; model: string; fields: Record<string, () => Promise<string>> };

function sentenceProfile(
  settings: Settings,
  clip: ImmersionClip,
  title: string,
  warn: (m: string) => void,
): Profile {
  if (!settings.ankiDeck || !settings.ankiModel) {
    throw new Error("Pick an Anki deck and note type in Settings → Dictionary & Anki");
  }
  const fields: Profile["fields"] = {};
  for (const [field, src] of Object.entries(settings.ankiFieldMap || {})) {
    if (SENTENCE_SOURCES.has(src)) fields[field] = async () => sentenceHtml(clip.sentence);
    else if (src === "sentence-audio") fields[field] = () => sentenceAudio(settings, clip);
    else if (src === "picture") fields[field] = () => picture(settings);
    else if (src === "clip") fields[field] = () => animatedClip(settings, clip, warn);
    else if (src === "title") fields[field] = async () => escapeHtml(title);
  }
  if (!Object.values(settings.ankiFieldMap || {}).includes("sentence-audio")) {
    throw new Error("Map a field to Sentence audio in Settings → Dictionary & Anki");
  }
  return { deck: settings.ankiDeck, model: settings.ankiModel, fields };
}

function audioProfile(settings: Settings, clip: ImmersionClip): Profile {
  const deck = settings.immersionAudioDeck;
  const model = settings.immersionAudioModel;
  const audioField = settings.immersionAudioField;
  if (!deck || !model || !audioField) {
    throw new Error(
      "Pick the audio card deck, note type and audio field in Settings → Dictionary & Anki",
    );
  }
  const fields: Profile["fields"] = { [audioField]: () => sentenceAudio(settings, clip) };
  const sentenceField = settings.immersionAudioSentenceField;
  if (sentenceField && sentenceField !== audioField) {
    fields[sentenceField] = async () => sentenceHtml(clip.sentence);
  }
  return { deck, model, fields };
}

async function resolveFields(
  profile: Profile,
  warnings: string[],
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(profile.fields).map(async ([field, make]) => {
      try {
        return [field, await make()] as const;
      } catch (e) {
        warnings.push(`${field}: ${String(e)}`);
        return [field, ""] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}

/** Adds a card (`new`, `audio`) or fills the newest recent card (`update`)
 *  from the given stretch of the playing video. mpv only. */
export async function exportImmersionCard(
  settings: Settings,
  target: ImmersionTarget,
  clip: ImmersionClip,
  title: string,
  selection?: WordSelection | null,
): Promise<ImmersionResult> {
  if (selection && target !== "audio") return exportWithWord(settings, target, clip, title, selection);
  const warnings: string[] = [];
  const warn = (m: string) => warnings.push(m);
  const profile =
    target === "audio"
      ? audioProfile(settings, clip)
      : sentenceProfile(settings, clip, title, warn);

  const noteId = target === "update" ? await recentNote(settings, profile.deck) : null;

  const fields = await resolveFields(profile, warnings);
  const audioOk = Object.values(fields).some((v) => v.startsWith("[sound:"));
  if (!audioOk) throw new Error(warnings[0] ?? "Couldn't capture the audio");

  if (noteId != null) {
    await fillNote(settings, noteId, fields);
    return { noteId, deck: profile.deck, warnings };
  }

  const names = await ankiModelFields(settings, profile.model);
  const first = names[0];
  if (first && !fields[first]?.trim()) fields[first] = invisibleMarker(fields);
  const tags = settings.ankiTags.split(/[\s,]+/).filter(Boolean);
  const created = await ankiInvoke<number>(settings, "addNote", {
    note: {
      deckName: profile.deck,
      modelName: profile.model,
      fields,
      tags,
      options: { allowDuplicate: settings.ankiAllowDuplicates, duplicateScope: "deck" },
    },
  });
  return { noteId: created, deck: profile.deck, warnings };
}
