import { open } from "@tauri-apps/plugin-dialog";
import { Loader2, Plus, RefreshCw, Trash2, Wand2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSettings, type AnkiFieldSource } from "@/lib/settings";
import { useT } from "@/lib/i18n";
import {
  deleteDictionary,
  importDictionary,
  listDictionaries,
  setDictionaryEnabled,
  type DictionaryInfo,
} from "@/lib/mining/dictionary";
import { ANKI_FIELD_SOURCES, ankiDeckNames, ankiModelFields, ankiModelNames, guessFieldMap } from "@/lib/mining/anki";
import { Section, ToggleRow } from "../shared";

const LANGUAGES = [
  ["japanese", "Japanese"],
  ["chinese", "Chinese"],
  ["korean", "Korean"],
  ["english", "English"],
  ["spanish", "Spanish"],
  ["portuguese", "Portuguese"],
  ["french", "French"],
  ["german", "German"],
  ["italian", "Italian"],
  ["russian", "Russian"],
  ["arabic", "Arabic"],
] as const;

const selectCls =
  "h-9 min-w-0 max-w-[240px] shrink-0 rounded-lg border border-edge bg-raised px-2.5 text-[12.5px] text-ink outline-none transition-colors focus:border-ink";
const inputCls =
  "h-9 min-w-0 rounded-lg border border-edge bg-raised px-2.5 text-[12.5px] text-ink outline-none transition-colors focus:border-ink";
const ghostBtn =
  "flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-edge-soft px-3 text-[12.5px] font-medium text-ink-muted transition-colors hover:border-edge hover:text-ink disabled:opacity-50";
const primaryBtn =
  "flex h-9 shrink-0 items-center gap-2 rounded-lg bg-ink px-4 text-[13px] font-semibold text-canvas transition-transform hover:scale-[1.02] active:scale-[0.97] disabled:opacity-60";

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge-soft bg-canvas/40 px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[14px] font-medium text-ink">{label}</span>
        {sub && <span className="text-[12.5px] text-ink-subtle">{sub}</span>}
      </div>
      {children}
    </div>
  );
}

export function MiningSection() {
  return (
    <>
      <DictionarySection />
      <WordAudioSection />
      <AnkiSection />
    </>
  );
}

function DictionarySection() {
  const { settings, update } = useSettings();
  const t = useT();
  const [dicts, setDicts] = useState<DictionaryInfo[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(() => {
    listDictionaries()
      .then(setDicts)
      .catch((e) => setMsg(String(e)));
  }, []);
  useEffect(refresh, [refresh]);

  const pick = async () => {
    const picked = await open({ multiple: true, filters: [{ name: "Yomitan dictionary", extensions: ["zip"] }] }).catch(
      () => null,
    );
    const paths = Array.isArray(picked) ? picked : typeof picked === "string" ? [picked] : [];
    const results: string[] = [];
    for (const p of paths) {
      setBusy(p.split(/[\\/]/).pop() ?? p);
      try {
        results.push(await importDictionary(p));
      } catch (e) {
        results.push(`${p.split(/[\\/]/).pop()}: ${String(e)}`);
      }
    }
    setBusy(null);
    if (results.length) setMsg(results.join("\n"));
    refresh();
  };

  return (
    <Section
      title={t("Subtitle dictionary")}
      subtitle={t("Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.")}
    >
      <ToggleRow
        label={t("Look up words in subtitles")}
        sub={t("Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.")}
        value={settings.subLookupEnabled}
        onChange={(v) => update({ subLookupEnabled: v })}
      />
      <ToggleRow
        label={t("Pause while the popup is open")}
        sub={t("Resumes when the popup closes.")}
        value={settings.subLookupPauseOnHover}
        onChange={(v) => update({ subLookupPauseOnHover: v })}
      />
      <Row label={t("Subtitle language")} sub={t("Picks the deinflection rules used for lookups.")}>
        <select
          value={settings.subLookupLanguage}
          onChange={(e) => update({ subLookupLanguage: e.target.value })}
          className={selectCls}
        >
          {LANGUAGES.map(([id, label]) => (
            <option key={id} value={id}>
              {t(label)}
            </option>
          ))}
        </select>
      </Row>

      <div className="flex flex-col gap-2">
        {dicts === null ? (
          <span className="text-[12.5px] text-ink-subtle">{t("Loading dictionaries…")}</span>
        ) : dicts.length === 0 ? (
          <span className="text-[12.5px] text-ink-subtle">
            {t("No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.")}
          </span>
        ) : (
          dicts.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-edge-soft bg-canvas/40 px-4 py-2.5"
            >
              <label className="flex min-w-0 items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={d.enabled}
                  onChange={(e) =>
                    setDictionaryEnabled(d.id, e.target.checked)
                      .then(refresh)
                      .catch((err) => setMsg(String(err)))
                  }
                />
                <span className="truncate text-[13.5px] text-ink">{d.name}</span>
              </label>
              <button
                type="button"
                title={t("Remove")}
                onClick={() =>
                  deleteDictionary(d.id)
                    .then(refresh)
                    .catch((err) => setMsg(String(err)))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 size={14} strokeWidth={2.2} />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={pick} disabled={!!busy} className={primaryBtn}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} strokeWidth={2.4} />}
          {busy ? t("Importing {name}…", { name: busy }) : t("Import dictionary (.zip)")}
        </button>
      </div>
      {msg && <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink-muted">{msg}</p>}
    </Section>
  );
}

function WordAudioSection() {
  const { settings, update } = useSettings();
  const t = useT();
  const pick = async () => {
    const picked = await open({ multiple: false, filters: [{ name: "Local audio database", extensions: ["db"] }] }).catch(
      () => null,
    );
    if (typeof picked === "string") update({ localAudioDbPath: picked });
  };
  return (
    <Section
      title={t("Word audio")}
      subtitle={t("Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders.")}
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border border-edge-soft bg-canvas/40 px-4 py-3">
        <span className="truncate font-mono text-[13px] text-ink" title={settings.localAudioDbPath}>
          {settings.localAudioDbPath || t("No database selected")}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={pick} className={primaryBtn}>
          {t("Choose database")}
        </button>
        {settings.localAudioDbPath && (
          <button type="button" onClick={() => update({ localAudioDbPath: "" })} className={ghostBtn}>
            {t("Clear")}
          </button>
        )}
      </div>
    </Section>
  );
}

function AnkiSection() {
  const { settings, update } = useSettings();
  const t = useT();
  const [decks, setDecks] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const [d, m] = await Promise.all([ankiDeckNames(settings), ankiModelNames(settings)]);
      setDecks(d);
      setModels(m);
      setStatus({ ok: true, text: t("Connected to Anki") });
    } catch (e) {
      setStatus({ ok: false, text: String(e) });
    } finally {
      setLoading(false);
    }
  }, [settings.ankiUrl]);

  useEffect(() => {
    if (!settings.ankiModel) {
      setFields([]);
      return;
    }
    ankiModelFields(settings, settings.ankiModel)
      .then(setFields)
      .catch(() => setFields([]));
  }, [settings.ankiModel, settings.ankiUrl, decks.length]);

  const setField = (field: string, src: AnkiFieldSource) =>
    update({ ankiFieldMap: { ...settings.ankiFieldMap, [field]: src } });

  const deckOptions = decks.includes(settings.ankiDeck) || !settings.ankiDeck ? decks : [settings.ankiDeck, ...decks];
  const modelOptions = models.includes(settings.ankiModel) || !settings.ankiModel ? models : [settings.ankiModel, ...models];

  return (
    <Section
      title={t("Anki")}
      subtitle={t("Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.")}
    >
      <Row label={t("AnkiConnect address")}>
        <div className="flex min-w-0 items-center gap-2">
          <input
            value={settings.ankiUrl}
            onChange={(e) => update({ ankiUrl: e.target.value })}
            placeholder="http://127.0.0.1:8765"
            className={`${inputCls} w-[210px]`}
          />
          <button type="button" onClick={connect} disabled={loading} className={ghostBtn}>
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} strokeWidth={2.2} />}
            {t("Connect")}
          </button>
        </div>
      </Row>
      {status && <p className={`text-[12.5px] ${status.ok ? "text-success" : "text-danger"}`}>{status.text}</p>}

      <Row label={t("Deck")}>
        <select value={settings.ankiDeck} onChange={(e) => update({ ankiDeck: e.target.value })} className={selectCls}>
          <option value="">{decks.length ? t("Choose…") : t("Connect first")}</option>
          {deckOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Row>
      <Row label={t("Note type")}>
        <select value={settings.ankiModel} onChange={(e) => update({ ankiModel: e.target.value, ankiFieldMap: {} })} className={selectCls}>
          <option value="">{models.length ? t("Choose…") : t("Connect first")}</option>
          {modelOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Row>

      {fields.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-edge-soft bg-canvas/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-ink">{t("Fields")}</span>
            <button type="button" onClick={() => update({ ankiFieldMap: guessFieldMap(fields) })} className={ghostBtn}>
              <Wand2 size={13} strokeWidth={2.2} />
              {t("Auto-fill")}
            </button>
          </div>
          {fields.map((f) => (
            <div key={f} className="flex items-center justify-between gap-3">
              <span className="truncate text-[13px] text-ink-muted">{f}</span>
              <select
                value={settings.ankiFieldMap[f] ?? ""}
                onChange={(e) => setField(f, e.target.value as AnkiFieldSource)}
                className={selectCls}
              >
                {ANKI_FIELD_SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {t(s.label)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <Row label={t("Tags")} sub={t("Separated by spaces.")}>
        <input
          value={settings.ankiTags}
          onChange={(e) => update({ ankiTags: e.target.value })}
          className={`${inputCls} w-[210px]`}
        />
      </Row>
      <Row label={t("Sentence audio padding")} sub={t("Seconds added before and after the subtitle line.")}>
        <input
          type="number"
          min={0}
          max={5}
          step={0.05}
          value={settings.ankiAudioPadSec}
          onChange={(e) => update({ ankiAudioPadSec: Math.max(0, Math.min(5, Number(e.target.value) || 0)) })}
          className={`${inputCls} w-[90px]`}
        />
      </Row>
      <ToggleRow
        label={t("Allow duplicate cards")}
        sub={t("When off, words already in the deck are refused.")}
        value={settings.ankiAllowDuplicates}
        onChange={(v) => update({ ankiAllowDuplicates: v })}
      />
    </Section>
  );
}
