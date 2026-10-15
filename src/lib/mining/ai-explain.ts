import type { Settings } from "@/lib/settings";
import { AI_EXPLAIN_DEFAULT_PROMPT } from "@/lib/settings/defaults";

// AI explanation of a looked-up word, from any OpenAI-compatible
// chat-completions endpoint (OpenRouter, OpenAI, DeepSeek, a local server…).
// Mirrors Fushi's "Custom" provider: endpoint used verbatim, optional
// OpenRouter routing and reasoning options, a user JSON body merged over the
// generated one, streaming or not, and cancellable requests.

const IDLE_TIMEOUT_MS = 30_000;
const CACHE_TTL_MS = 60_000;
const CACHE_MAX = 64;
const FALLBACK_MODEL = "gpt-4o-mini";

export type AiExplainInput = {
  // The dictionary form shown in the popup ({{target}}).
  target: string;
  // The subtitle it was found in ({{sentence}}).
  sentence: string;
};

export class AiCancelledError extends Error {
  constructor() {
    super("Cancelled");
    this.name = "AiCancelledError";
  }
}

export class AiTimeoutError extends Error {
  constructor() {
    super("The AI request timed out. Please try again.");
    this.name = "AiTimeoutError";
  }
}

// ---------- configuration ----------

export function isOpenRouterEndpoint(endpoint: string): boolean {
  try {
    const host = new URL(endpoint.trim()).hostname.toLowerCase();
    return host === "openrouter.ai" || host.endsWith(".openrouter.ai");
  } catch {
    return false;
  }
}

/** Why the AI explanation cannot run, or null when it is ready. */
export function aiExplainProblem(settings: Settings): string | null {
  if (!settings.aiExplainEndpoint.trim()) return "Set the AI endpoint in Settings → Dictionary & Anki.";
  if (!settings.aiExplainKey.trim()) return "Set the AI API key in Settings → Dictionary & Anki.";
  if (!settings.aiExplainModel.trim()) return "Set the AI model in Settings → Dictionary & Anki.";
  return null;
}

export function aiExplainReady(settings: Settings): boolean {
  return settings.subLookupAiEnabled && aiExplainProblem(settings) === null;
}

/** null when valid (or empty), else the reason. */
export function validateBodyJson(raw: string): string | null {
  const text = raw.trim();
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? null : "Not a valid JSON object.";
  } catch (e) {
    return `Not a valid JSON object: ${(e as Error).message}`;
  }
}

// ---------- request building ----------

export function renderPrompts(settings: Settings, input: AiExplainInput): { system: string; user: string } {
  const fill = (s: string) => s.split("{{target}}").join(input.target).split("{{sentence}}").join(input.sentence);
  const user = fill(settings.aiExplainPrompt).trim() ? fill(settings.aiExplainPrompt) : fill(AI_EXPLAIN_DEFAULT_PROMPT);
  return { system: fill(settings.aiExplainSystemPrompt), user };
}

function clampTemperature(t: number): number {
  return Number.isFinite(t) ? Math.max(0, Math.min(2, t)) : 0.7;
}

/** Custom thinking value: a token count, a JSON object, or an effort word. */
export function parseThinkingValue(value: string): Record<string, unknown> {
  const v = value.trim();
  if (!v) return {};
  if (/^\d+$/.test(v)) return { max_tokens: Number(v) };
  if (v.startsWith("{")) {
    try {
      const parsed = JSON.parse(v);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {
      /* falls through to an effort word */
    }
  }
  return { effort: v === "max" ? "xhigh" : v };
}

function applyReasoning(body: Record<string, unknown>, settings: Settings, openRouter: boolean) {
  const mode = settings.aiExplainThinkingMode;
  const intensity = settings.aiExplainThinkingIntensity;
  const custom = settings.aiExplainThinkingValue.trim();
  const effort = intensity === "custom" ? custom : intensity;
  const hasMode = mode === "enabled" || mode === "disabled";
  // Untouched options leave the request exactly as without the feature.
  if (!hasMode && !effort) return;
  if (openRouter) {
    let reasoning: Record<string, unknown> = {};
    if (mode === "disabled") reasoning.effort = "none";
    else if (intensity === "custom" && custom) reasoning = { ...parseThinkingValue(custom) };
    else if (effort) reasoning.effort = effort === "max" ? "xhigh" : effort;
    else reasoning.enabled = true;
    // The model's internal reasoning never belongs in the popup.
    reasoning.exclude = true;
    body.reasoning = reasoning;
    return;
  }
  if (hasMode) body.thinking = { type: mode };
  if (mode !== "disabled" && effort) body.reasoning_effort = effort;
}

function applyRouting(body: Record<string, unknown>, settings: Settings, openRouter: boolean) {
  if (!openRouter) return;
  const slugs = settings.aiExplainRoutingSlugs
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const provider: Record<string, unknown> = {};
  const mode = settings.aiExplainRoutingMode;
  if (slugs.length && mode) provider[mode] = slugs;
  provider.allow_fallbacks = settings.aiExplainAllowFallbacks;
  body.provider = provider;
}

/** Objects merge key by key; anything else (arrays included) replaces. */
export function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const [k, v] of Object.entries(source)) {
    const cur = target[k];
    const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
    if (isObj(cur) && isObj(v)) deepMerge(cur, v);
    else target[k] = v;
  }
}

export type AiRequest = { url: string; headers: Record<string, string>; body: Record<string, unknown> };

/** Builds the HTTP request. Throws on a bad endpoint or body JSON, before any network call. */
export function buildAiRequest(settings: Settings, input: AiExplainInput, stream: boolean): AiRequest {
  const url = settings.aiExplainEndpoint.trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("The endpoint must be a full URL, for example https://api.example.com/v1/chat/completions");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`Unsupported endpoint scheme "${parsed.protocol.replace(":", "")}": use https (or http for a local server).`);
  }
  const openRouter = isOpenRouterEndpoint(url);
  const { system, user } = renderPrompts(settings, input);
  const body: Record<string, unknown> = {
    model: settings.aiExplainModel.trim() || FALLBACK_MODEL,
    messages: [...(system.trim() ? [{ role: "system", content: system }] : []), { role: "user", content: user }],
    temperature: clampTemperature(settings.aiExplainTemperature),
  };
  applyReasoning(body, settings, openRouter);
  applyRouting(body, settings, openRouter);
  const raw = settings.aiExplainBodyJson.trim();
  if (raw) {
    const problem = validateBodyJson(raw);
    if (problem) throw new Error(`Custom request body JSON: ${problem}`);
    deepMerge(body, JSON.parse(raw));
  }
  // After the merge, so a stored "stream": false cannot undo the setting.
  if (stream) body.stream = true;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${settings.aiExplainKey.trim()}`,
  };
  if (openRouter) {
    headers["HTTP-Referer"] = "https://harbor.site";
    headers["X-Title"] = "Harbor";
  }
  return { url, headers, body };
}

// ---------- cache ----------

function signature(settings: Settings): string {
  return JSON.stringify([
    settings.aiExplainEndpoint.trim(),
    settings.aiExplainModel.trim(),
    settings.aiExplainPrompt,
    settings.aiExplainSystemPrompt,
    clampTemperature(settings.aiExplainTemperature),
    settings.aiExplainRoutingMode,
    settings.aiExplainRoutingSlugs,
    settings.aiExplainAllowFallbacks,
    settings.aiExplainThinkingMode,
    settings.aiExplainThinkingIntensity,
    settings.aiExplainThinkingValue,
    settings.aiExplainBodyJson,
  ]);
}

export function aiCacheKey(settings: Settings, input: AiExplainInput): string {
  return JSON.stringify([input.target, input.sentence, signature(settings)]);
}

const cache = new Map<string, { text: string; at: number }>();

function remember(key: string, text: string) {
  cache.delete(key);
  cache.set(key, { text, at: Date.now() });
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
}

export function cachedAiExplanation(settings: Settings, input: AiExplainInput): string | null {
  const key = aiCacheKey(settings, input);
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.text;
}

// ---------- requests ----------

type Running = {
  key: string;
  text: string;
  controller: AbortController;
  // Why the request was aborted.
  stop: "cancel" | "timeout" | null;
  promise: Promise<string>;
  listeners: Set<(text: string) => void>;
};

const running = new Map<string, Running>();

export function isAiExplanationRunning(settings: Settings, input: AiExplainInput): boolean {
  return running.has(aiCacheKey(settings, input));
}

/** Cancels one explanation, or every unfinished one. */
export function cancelAiExplanation(key?: string) {
  for (const run of Array.from(running.values())) {
    if (key && run.key !== key) continue;
    run.stop = "cancel";
    run.controller.abort();
    running.delete(run.key);
  }
}

/** Starts (or joins) the explanation for `input`. `onText` receives the text
 *  so far as it streams in. Resolves with the final text; rejects with
 *  AiCancelledError, AiTimeoutError or the provider's error. */
export function explainWord(
  settings: Settings,
  input: AiExplainInput,
  opts: { force?: boolean; onText?: (text: string) => void } = {},
): Promise<string> {
  const key = aiCacheKey(settings, input);
  if (opts.force) {
    cache.delete(key);
    cancelAiExplanation(key);
  } else {
    const hit = cachedAiExplanation(settings, input);
    if (hit != null) {
      opts.onText?.(hit);
      return Promise.resolve(hit);
    }
    const joined = running.get(key);
    if (joined) {
      if (opts.onText) {
        joined.listeners.add(opts.onText);
        if (joined.text) opts.onText(joined.text);
      }
      return joined.promise;
    }
  }
  // With "cancel unfinished requests", a new word drops the others.
  if (settings.aiExplainCancelPending) cancelAiExplanation();

  let request: { stream: AiRequest; plain: AiRequest };
  try {
    request = {
      stream: buildAiRequest(settings, input, settings.aiExplainStream),
      plain: buildAiRequest(settings, input, false),
    };
  } catch (e) {
    return Promise.reject(e);
  }

  const run: Running = {
    key,
    text: "",
    controller: new AbortController(),
    stop: null,
    listeners: new Set(opts.onText ? [opts.onText] : []),
    promise: Promise.resolve(""),
  };
  const emit = (text: string) => {
    run.text = text;
    for (const l of run.listeners) l(text);
  };
  run.promise = (async () => {
    let text: string;
    try {
      text = await send(run, request.stream, settings.aiExplainStream, emit);
    } catch (e) {
      // A stream that failed before any text arrived gets one plain retry,
      // unless it was cancelled or timed out.
      if (!settings.aiExplainStream || run.stop || run.text) throw e;
      text = await send(run, request.plain, false, emit);
    }
    text = text.trim();
    if (!text) throw new Error("No explanation available.");
    remember(key, text);
    emit(text);
    return text;
  })()
    .catch((e) => {
      if (run.stop === "cancel") throw new AiCancelledError();
      if (run.stop === "timeout") throw new AiTimeoutError();
      throw e;
    })
    .finally(() => {
      if (running.get(key) === run) running.delete(key);
    });
  running.set(key, run);
  return run.promise;
}

async function send(run: Running, req: AiRequest, stream: boolean, emit: (text: string) => void): Promise<string> {
  let idle = 0;
  const arm = () => {
    window.clearTimeout(idle);
    idle = window.setTimeout(() => {
      run.stop = "timeout";
      run.controller.abort();
    }, IDLE_TIMEOUT_MS);
  };
  arm();
  try {
    const res = await fetch(req.url, {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify(req.body),
      signal: run.controller.signal,
    });
    arm();
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}). ${errorMessage(body)}`.trim());
    }
    if (!stream || !res.body) {
      const raw = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`The AI returned something that is not JSON: ${raw.slice(0, 160)}`);
      }
      const err = providerError(data);
      if (err) throw new Error(err);
      const text = completionText(data);
      emit(text);
      return text;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let streamError = "";
    const take = (ev: string): boolean => {
      const r = sseEvent(ev);
      if (r === "done") return true;
      if (r?.error) streamError = r.error;
      if (r?.delta) {
        text += r.delta;
        emit(text);
      }
      return false;
    };
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      arm();
      buf += decoder.decode(value, { stream: true });
      const events = buf.split(/\r\n\r\n|\n\n|\r\r/);
      buf = events.pop() ?? "";
      let finished = false;
      for (const ev of events) if (take(ev)) finished = true;
      if (finished) {
        reader.cancel().catch(() => {});
        buf = "";
        break;
      }
    }
    buf += decoder.decode();
    if (buf.trim()) take(buf);
    // An error inside the stream only counts once the stream is drained.
    if (streamError && !text) throw new Error(streamError);
    return text;
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
    const err = providerError(json);
    if (err) return { error: err };
    return { delta: partsText(json?.choices?.[0]?.delta?.content) };
  } catch {
    return null;
  }
}

function partsText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((p) => (typeof p === "string" ? p : typeof p?.text === "string" ? p.text : "")).join("");
  }
  return "";
}

function completionText(data: unknown): string {
  const choice = (data as { choices?: { message?: { content?: unknown }; text?: unknown }[] })?.choices?.[0];
  const fromMessage = partsText(choice?.message?.content);
  if (fromMessage) return fromMessage;
  return typeof choice?.text === "string" ? choice.text : "";
}

function providerError(data: unknown): string | null {
  const d = data as { error?: unknown; message?: unknown; choices?: unknown };
  if (!d || typeof d !== "object" || d.choices) return null;
  const e = d.error as { message?: unknown } | string | undefined;
  if (typeof e === "string") return e;
  if (e && typeof e.message === "string") return e.message;
  return null;
}

function errorMessage(body: string): string {
  try {
    const j = JSON.parse(body);
    const m = j?.error?.message ?? j?.error ?? j?.message;
    if (typeof m === "string") return m.slice(0, 300);
  } catch {
    /* not JSON */
  }
  return body.slice(0, 300);
}

/** Minimal Markdown (bold, italics, line breaks) to HTML for Anki fields. */
export function aiTextToHtml(text: string): string {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>")
    .replace(/\r?\n/g, "<br>");
}
