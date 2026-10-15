import { invoke } from "@tauri-apps/api/core";

export type LocalAudioEntry = { source: string; speaker: string | null; file: string; label: string };

export async function findWordAudio(dbPath: string, term: string, reading: string): Promise<LocalAudioEntry[]> {
  if (!dbPath) return [];
  return invoke<LocalAudioEntry[]>("local_audio_lookup", { dbPath, term, reading: reading || null });
}

const dataCache = new Map<string, Promise<string>>();

export function wordAudioDataUrl(dbPath: string, entry: LocalAudioEntry): Promise<string> {
  const key = `${dbPath}\u0000${entry.source}\u0000${entry.file}`;
  let p = dataCache.get(key);
  if (!p) {
    p = invoke<string>("local_audio_data", { dbPath, source: entry.source, file: entry.file });
    p.catch(() => dataCache.delete(key));
    dataCache.set(key, p);
    if (dataCache.size > 64) {
      const oldest = dataCache.keys().next().value;
      if (oldest !== undefined) dataCache.delete(oldest);
    }
  }
  return p;
}

let current: HTMLAudioElement | null = null;

export async function playWordAudio(dbPath: string, entry: LocalAudioEntry): Promise<void> {
  const url = await wordAudioDataUrl(dbPath, entry);
  current?.pause();
  current = new Audio(url);
  await current.play();
}

export function audioExtension(file: string): string {
  const m = /\.([a-z0-9]{2,5})$/i.exec(file);
  return m ? m[1].toLowerCase() : "mp3";
}
