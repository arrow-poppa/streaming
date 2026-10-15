import { isMacDesktop, isWindowsDesktop } from "@/lib/platform";
import { safeFetch } from "@/lib/safe-fetch";

// Set a new history URL here when a new update provider is configured.
const INDEX_URL: string = "";
export const VERSION_HISTORY_CONFIGURED = INDEX_URL.length > 0;

export type VersionEntry = {
  version: string;
  date?: string;
  notes?: string;
  win?: string;
  mac?: string;
  channel?: "beta" | "stable";
};

export const currentVersion = __APP_VERSION__;

export async function fetchVersionHistory(): Promise<VersionEntry[]> {
  if (!VERSION_HISTORY_CONFIGURED) return [];
  const res = await safeFetch(INDEX_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`history ${res.status}`);
  const data = (await res.json()) as { versions?: VersionEntry[] };
  const list = Array.isArray(data.versions) ? data.versions : [];
  return list.filter((v) => v && typeof v.version === "string");
}

export function installerUrl(entry: VersionEntry): string | null {
  if (isWindowsDesktop()) return entry.win ?? null;
  if (isMacDesktop()) return entry.mac ?? null;
  return null;
}
