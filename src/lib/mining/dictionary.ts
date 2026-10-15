import { invoke } from "@tauri-apps/api/core";
import { isMobileTauri, isWeb } from "@/lib/platform";

// The dictionary engine, local audio and Anki bridge exist in the desktop app only.
export function miningAvailable(): boolean {
  return !isWeb() && !isMobileTauri();
}

// Response shape of Manatan's grouped lookup (see src-tauri/src/dictionary.rs).
export type DictTag = { name: string; category?: string; description?: string; order?: number };

export type DictTerm = {
  headword: string;
  reading: string;
  furigana: [string, string][];
  glossary: { dictionaryName: string; tags: string[]; content: unknown[] }[];
  frequencies: { dictionaryName: string; value: string }[];
  pitchAccents: { dictionaryName: string; reading: string; pitches: { position: number }[] }[];
  forms: { headword: string; reading: string }[];
  termTags: DictTag[];
  // Matched source length in Unicode code points.
  matchLen: number;
  styles?: Record<string, string>;
  // No dictionary knows this word; the popup shows only the AI explanation.
  synthetic?: boolean;
};

export type DictLookupResult = { terms: DictTerm[]; kanji: unknown[] };

export type DictionaryInfo = { id: number; name: string; priority: number; enabled: boolean };

const cache = new Map<string, Promise<DictLookupResult>>();
const CACHE_MAX = 300;

// `index` is a UTF-16 offset into `text`, which is what DOM caret APIs return.
export function lookupDictionary(text: string, index: number, language: string): Promise<DictLookupResult> {
  const key = `${language}\u0000${index}\u0000${text}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const p = invoke<DictLookupResult>("dict_lookup", { text, index, language }).catch((e) => {
    cache.delete(key);
    throw e;
  });
  cache.set(key, p);
  if (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  return p;
}

export function clearLookupCache() {
  cache.clear();
}

export async function importDictionary(path: string): Promise<string> {
  const msg = await invoke<string>("dict_import", { path });
  clearLookupCache();
  return msg;
}

export async function listDictionaries(): Promise<DictionaryInfo[]> {
  const res = await invoke<{ dictionaries?: DictionaryInfo[] }>("dict_list");
  return res.dictionaries ?? [];
}

export async function deleteDictionary(id: number): Promise<void> {
  await invoke("dict_manage", { action: { action: "Delete", payload: { id } } });
  clearLookupCache();
}

export async function setDictionaryEnabled(id: number, enabled: boolean): Promise<void> {
  await invoke("dict_manage", { action: { action: "Toggle", payload: { id, enabled } } });
  clearLookupCache();
}

const mediaCache = new Map<string, Promise<string>>();

export function dictionaryMedia(dictionary: string, path: string): Promise<string> {
  const key = `${dictionary}\u0000${path}`;
  let p = mediaCache.get(key);
  if (!p) {
    p = invoke<string>("dict_media", { dictionary, path });
    p.catch(() => mediaCache.delete(key));
    mediaCache.set(key, p);
  }
  return p;
}

// Code point count -> UTF-16 length, starting at a UTF-16 offset.
export function codePointsToUtf16(text: string, from: number, codePoints: number): number {
  let i = from;
  let n = 0;
  while (i < text.length && n < codePoints) {
    const c = text.charCodeAt(i);
    i += c >= 0xd800 && c <= 0xdbff && i + 1 < text.length ? 2 : 1;
    n++;
  }
  return i - from;
}
