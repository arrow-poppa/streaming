// Renders Yomitan glossary entries (plain strings or "structured-content")
// to an HTML string. Only whitelisted tags are emitted and every text and
// attribute value is escaped, so the result is safe to inject.
import type { DictTerm } from "./dictionary";

const ALLOWED_TAGS = new Set([
  "br", "ruby", "rt", "rp", "table", "thead", "tbody", "tfoot", "tr", "td", "th",
  "span", "div", "ol", "ul", "li", "details", "summary", "a", "img",
]);

type Node = unknown;

export type GlossaryHtmlOptions = {
  // Popup: emit <img> placeholders resolved later via dict_media. Anki: drop images.
  images: boolean;
  dictionary: string;
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function styleAttr(style: unknown): string {
  if (!style || typeof style !== "object") return "";
  const parts: string[] = [];
  for (const [k, v] of Object.entries(style as Record<string, unknown>)) {
    if (!/^[a-zA-Z]+$/.test(k)) continue;
    const raw = typeof v === "number" ? (k === "fontWeight" || k === "lineHeight" ? String(v) : `${v}em`) : v;
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    if (!value || /url\s*\(|expression|[;{}<>\\]/i.test(value)) continue;
    parts.push(`${kebab(k)}:${value}`);
  }
  return parts.length ? ` style="${escapeHtml(parts.join(";"))}"` : "";
}

function dataAttrs(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  let out = "";
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    if (!/^[a-zA-Z0-9-]+$/.test(k) || (typeof v !== "string" && typeof v !== "number")) continue;
    out += ` data-sc-${escapeHtml(kebab(k))}="${escapeHtml(String(v))}"`;
  }
  return out;
}

function imageHtml(n: Record<string, unknown>, opts: GlossaryHtmlOptions): string {
  const alt = typeof n.alt === "string" ? n.alt : typeof n.title === "string" ? n.title : "";
  if (!opts.images || typeof n.path !== "string") return alt ? escapeHtml(alt) : "";
  const size = (v: unknown) => (typeof v === "number" && v > 0 && v < 100 ? `${v}em` : null);
  const w = size(n.width);
  const h = size(n.height);
  const style = [w ? `width:${w}` : "", h ? `height:${h}` : ""].filter(Boolean).join(";");
  return (
    `<img class="hb-dict-img" alt="${escapeHtml(alt)}"` +
    ` data-hb-dict="${escapeHtml(opts.dictionary)}" data-hb-path="${escapeHtml(n.path)}"` +
    (style ? ` style="${style}"` : "") +
    ">"
  );
}

function render(node: Node, opts: GlossaryHtmlOptions, depth: number): string {
  if (depth > 64 || node == null) return "";
  if (typeof node === "string") return escapeHtml(node).replace(/\n/g, "<br>");
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((c) => render(c, opts, depth + 1)).join("");
  if (typeof node !== "object") return "";
  const n = node as Record<string, unknown>;

  if (n.type === "structured-content") return render(n.content, opts, depth + 1);
  if (n.type === "text") return render(n.text, opts, depth + 1);
  if (n.type === "image") return imageHtml(n, opts);

  const tag = typeof n.tag === "string" ? n.tag : "";
  if (!ALLOWED_TAGS.has(tag)) return render(n.content, opts, depth + 1);
  if (tag === "br") return "<br>";
  if (tag === "img") return imageHtml(n, opts);

  // Internal dictionary links ("?query=...") become plain styled text.
  const outTag = tag === "a" ? "span" : tag;
  let attrs = ` class="gloss-sc-${tag}${tag === "a" ? " hb-dict-link" : ""}"`;
  attrs += dataAttrs(n.data);
  attrs += styleAttr(n.style);
  if (typeof n.lang === "string" && /^[a-zA-Z-]{1,16}$/.test(n.lang)) attrs += ` lang="${n.lang}"`;
  if (typeof n.title === "string") attrs += ` title="${escapeHtml(n.title)}"`;
  if ((tag === "td" || tag === "th") && typeof n.colSpan === "number") attrs += ` colspan="${Math.min(50, n.colSpan | 0)}"`;
  if ((tag === "td" || tag === "th") && typeof n.rowSpan === "number") attrs += ` rowspan="${Math.min(50, n.rowSpan | 0)}"`;
  if (tag === "details" && n.open === true) attrs += " open";
  return `<${outTag}${attrs}>${render(n.content, opts, depth + 1)}</${outTag}>`;
}

function parseEntry(entry: unknown): Node {
  if (typeof entry !== "string") return entry;
  const s = entry.trim();
  if (s.startsWith("{") || s.startsWith("[")) {
    try {
      return JSON.parse(s);
    } catch {
      return entry;
    }
  }
  return entry;
}

export function glossaryEntryHtml(content: unknown[], opts: GlossaryHtmlOptions): string {
  const items = content.map((c) => render(parseEntry(c), opts, 0)).filter((h) => h.trim() !== "");
  if (items.length <= 1) return items.join("");
  return `<ul class="hb-gloss-list">${items.map((h) => `<li>${h}</li>`).join("")}</ul>`;
}

// Glossary HTML for an Anki field, Yomitan-style: one <li> per sense, tagged with
// its part-of-speech and dictionary.
export function termGlossaryHtml(term: DictTerm, firstOnly = false): string {
  const groups = firstOnly ? term.glossary.slice(0, 1) : term.glossary;
  const items = groups.map((g) => {
    const tags = [...g.tags.filter((t) => !/^\d+$/.test(t)), g.dictionaryName].join(", ");
    const body = glossaryEntryHtml(g.content, { images: false, dictionary: g.dictionaryName });
    return `<li><i>(${escapeHtml(tags)})</i> ${body}</li>`;
  });
  if (firstOnly) return items.join("").replace(/^<li>|<\/li>$/g, "");
  return `<div style="text-align: left;"><ol>${items.join("")}</ol></div>`;
}

// Scopes a dictionary's styles.css under its container so it cannot restyle the app.
export function scopedDictionaryCss(dictionary: string, css: string): string {
  if (!css || /@import|url\s*\(|expression|<\/?style/i.test(css)) return "";
  let depth = 0;
  for (const ch of css) {
    if (ch === "{") depth++;
    else if (ch === "}" && --depth < 0) return "";
  }
  if (depth !== 0) return "";
  const sel = `.hb-dict-entry[data-dictionary="${dictionary.replace(/["\\]/g, "\\$&")}"]`;
  return `${sel} {\n${css}\n}`;
}
