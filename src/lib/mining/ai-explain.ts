import { DEFAULT_AI_MODEL, keyForProvider, migrateModelId, providerForModel } from "@/lib/ai-models";
import type { Settings } from "@/lib/settings";

// AI explanation of a looked-up word in its subtitle sentence. Uses the same
// OpenRouter / Groq key and endpoints as AI Search.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const IDLE_TIMEOUT_MS = 30_000;
const CACHE_MAX = 64;

export type AiExplainInput = {
  // Dictionary form, when the dictionary found one; else the surface form.
  word: string;
  // The text as it appears in the subtitle.
  surface: string;
  sentence: string;
};

type Config = { url: string; key: string; model: string; groq: boolean };

function config(settings: Settings): Config | null {
  const model = migrateModelId((settings.subLookupAiModel || settings.aiSearchModel || DEFAULT_AI_MODEL).trim());
  const provider = providerForModel(model);
  const key = keyForProvider(settings, provider).trim();
  if (!key) return null;
  const groq = provider === "groq";
  return { url: groq ? GROQ_URL : OPENROUTER_URL, key, model, groq };
}

export function aiExplainReady(settings: Settings): boolean {
  return settings.subLookupAiEnabled && !!config(settings);
}

export function aiExplainModel(settings: Settings): string {
  return config(settings)?.model ?? "";
}

function languageName(id: string): string {
  const s = (id || "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "the subtitle's language";
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(word|surface|sentence|language)\}/g, (_, k: string) => vars[k] ?? "");
}

export function buildAiMessages(settings: Settings, input: AiExplainInput): { role: string; content: string }[] {
  const language = languageName(settings.subLookupLanguage);
  const answer = settings.subLookupAiAnswerLanguage.trim() || "English";
  const vars = { word: input.word, surface: input.surface, sentence: input.sentence, language };
  const system =
    `You help someone learning ${language} from film and TV subtitles. Always answer in ${answer}. ` +
    "Be brief: two to four short sentences of plain text, no headings and no lists.";
  const custom = settings.subLookupAiPrompt.trim();
  const user = custom
    ? fill(custom, vars)
    : `Subtitle: "${input.sentence}"\n` +
      `Word: "${input.surface}"` +
      (input.word && input.word !== input.surface ? ` (dictionary form: "${input.word}")` : "") +
      "\n\nExplain what this word means in this subtitle and how it is used here. " +
      "If it belongs to an expression, idiom or phrasal verb, explain the whole expression.";
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function cacheKey(settings: Settings, input: AiExplainInput): string {
  const c = config(settings);
  return JSON.stringify([c?.model, buildAiMessages(settings, input), input]);
}

const cache = new Map<string, string>();

function remember(key: string, text: string) {
  cache.delete(key);
  cache.set(key, text);
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
}

export function cachedAiExplanation(settings: Settings, input: AiExplainInput): string | null {
  return cache.get(cacheKey(settings, input)) ?? null;
}

type Running = {
  key: string;
  text: string;
  controller: AbortController;
  promise: Promise<string>;
  listeners: Set<(text: string) => void>;
};

// Only one request runs at a time: starting another word cancels the last one.
let running: Running | null = null;

export function cancelAiExplanation() {
  running?.controller.abort();
  running = null;
}

/** Starts (or joins) the explanation for `input`. `onText` receives the text
 *  so far as it streams in. Resolves with the final text. */
export function explainWord(
  settings: Settings,
  input: AiExplainInput,
  opts: { force?: boolean; onText?: (text: string) => void } = {},
): Promise<string> {
  const key = cacheKey(settings, input);
  if (opts.force) cache.delete(key);
  const hit = cache.get(key);
  if (hit != null) {
    opts.onText?.(hit);
    return Promise.resolve(hit);
  }
  if (running && running.key === key && !opts.force) {
    if (opts.onText) {
      running.listeners.add(opts.onText);
      if (running.text) opts.onText(running.text);
    }
    return running.promise;
  }
  cancelAiExplanation();
  const cfg = config(settings);
  if (!cfg) return Promise.reject(new Error("Add an AI key in Settings → Library → AI Search"));

  const controller = new AbortController();
  const listeners = new Set<(text: string) => void>();
  if (opts.onText) listeners.add(opts.onText);
  const run: Running = { key, text: "", controller, listeners, promise: Promise.resolve("") };
  const emit = (text: string) => {
    run.text = text;
    for (const l of listeners) l(text);
  };
  const messages = buildAiMessages(settings, input);
  run.promise = (async () => {
    let text = "";
    try {
      text = await request(cfg, messages, controller, true, emit);
    } catch (e) {
      // A stream that failed before any text arrived gets one plain retry.
      if (controller.signal.aborted || run.text) throw e;
      text = await request(cfg, messages, controller, false, emit);
    }
    text = text.trim();
    if (!text) throw new Error("The AI returned an empty answer");
    remember(key, text);
    emit(text);
    return text;
  })().finally(() => {
    if (running === run) running = null;
  });
  running = run;
  return run.promise;
}

async function request(
  cfg: Config,
  messages: { role: string; content: string }[],
  controller: AbortController,
  stream: boolean,
  emit: (text: string) => void,
): Promise<string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${cfg.key}`,
    "Content-Type": "application/json",
  };
  if (!cfg.groq) {
    headers["HTTP-Referer"] = "https://harbor.site";
    headers["X-Title"] = "Harbor";
  }
  let idle = 0;
  const arm = () => {
    window.clearTimeout(idle);
    idle = window.setTimeout(() => controller.abort(new Error("The AI took too long to answer")), IDLE_TIMEOUT_MS);
  };
  arm();
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({ model: cfg.model, temperature: 0.4, stream, messages }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}). ${errorMessage(body)}`.trim());
    }
    if (!stream || !res.body) {
      const data = await res.json();
      const text = messageText(data?.choices?.[0]?.message?.content);
      emit(text);
      return text;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let streamError = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      arm();
      buf += decoder.decode(value, { stream: true });
      const events = buf.split(/\r\n\r\n|\n\n|\r\r/);
      buf = events.pop() ?? "";
      for (const ev of events) {
        const r = sseEvent(ev);
        if (r === "done") return text;
        if (!r) continue;
        if (r.error) streamError = r.error;
        if (r.delta) {
          text += r.delta;
          emit(text);
        }
      }
    }
    const tail = sseEvent(buf);
    if (tail && tail !== "done" && tail.delta) {
      text += tail.delta;
      emit(text);
    }
    if (!text && streamError) throw new Error(streamError);
    return text;
  } catch (e) {
    if (controller.signal.aborted && controller.signal.reason instanceof Error) throw controller.signal.reason;
    throw e;
  } finally {
    window.clearTimeout(idle);
  }
}

function sseEvent(ev: string): "done" | { delta?: string; error?: string } | null {
  const data = ev
    .split(/\r\n|\n|\r/)
    .filter((l) => l.startsWith("data:"))
    .map((l) => l.slice(5).replace(/^ /, ""))
    .join("\n");
  if (!data) return null;
  if (data.trim() === "[DONE]") return "done";
  try {
    const json = JSON.parse(data);
    if (json?.error) return { error: errorMessage(JSON.stringify(json)) };
    return { delta: messageText(json?.choices?.[0]?.delta?.content) };
  } catch {
    return null;
  }
}

function messageText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((p) => (typeof p === "string" ? p : typeof p?.text === "string" ? p.text : "")).join("");
  }
  return "";
}

function errorMessage(body: string): string {
  try {
    const j = JSON.parse(body);
    const m = j?.error?.message ?? j?.error ?? j?.message;
    if (typeof m === "string") return m.slice(0, 200);
  } catch {
    /* not JSON */
  }
  return body.slice(0, 200);
}

/** Minimal Markdown (bold, italics, line breaks) to HTML for Anki fields. */
export function aiTextToHtml(text: string): string {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>")
    .replace(/\r?\n/g, "<br>");
}
