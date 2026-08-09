import { parseHeadings } from "./markdownHeadings";

const ATX_HEADING = /^(#{1,6})\s+(.*?)(?:\s+#+\s*)?$/;

export interface MarkdownCard {
  /** Opaque, deterministic identifier used only to attach visual metadata. */
  id: string;
  level: number;
  title: string;
  parentId: string | null;
  /** UTF-16 offsets, matching String.slice and editor offsets. */
  start: number;
  end: number;
  /** Exact source slice used to reject stale writes. */
  original: string;
  /** Markdown displayed and edited by the card. */
  markdown: string;
}

function lineStartOffsets(source: string): number[] {
  const offsets = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source.charCodeAt(index) === 10) offsets.push(index + 1);
  }
  return offsets;
}

// FNV-1a produces short stable ids without storing source text in metadata.
function opaqueId(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `card-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

/**
 * Project a Markdown document into one card per ATX heading. A card owns only
 * its heading and direct content up to the next heading; descendant sections
 * become their own cards and are linked through parentId.
 */
export function parseMarkdownCards(source: string): MarkdownCard[] {
  const headings = parseHeadings(source);
  if (headings.length === 0) return [];

  const starts = lineStartOffsets(source);
  const cards: MarkdownCard[] = [];
  const ancestors: MarkdownCard[] = [];

  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const start = starts[heading.line] ?? source.length;
    const next = headings[index + 1];
    const end = next ? (starts[next.line] ?? source.length) : source.length;

    while (ancestors.length > 0 && ancestors.at(-1)!.level >= heading.level) {
      ancestors.pop();
    }

    const structuralPath = [...ancestors.map((card) => card.id), `${heading.level}:${index}`].join(
      "/",
    );
    const original = source.slice(start, end);
    const card: MarkdownCard = {
      id: opaqueId(structuralPath),
      level: heading.level,
      title: heading.text,
      parentId: ancestors.at(-1)?.id ?? null,
      start,
      end,
      original,
      markdown: original,
    };
    cards.push(card);
    ancestors.push(card);
  }

  return cards;
}

function normalizeLineEndings(value: string, lineEnding: "\r\n" | "\n"): string {
  return value.replace(/\r\n|\r|\n/g, lineEnding);
}

/**
 * Replace exactly one projected card. The stale-slice guard is intentional:
 * an external edit must be reparsed and shown before an inline card edit can
 * overwrite it.
 */
export function replaceMarkdownCard(
  source: string,
  card: MarkdownCard,
  nextMarkdown: string,
): string {
  if (source.slice(card.start, card.end) !== card.original) {
    throw new Error("The document changed externally; reload the Cards view before editing.");
  }

  const firstLine = nextMarkdown.split(/\r?\n/, 1)[0];
  const heading = ATX_HEADING.exec(firstLine);
  if (!heading) throw new Error("A card must start with an ATX Markdown heading.");

  const lineEnding = card.original.includes("\r\n") ? "\r\n" : "\n";
  const normalized = normalizeLineEndings(nextMarkdown, lineEnding);
  return source.slice(0, card.start) + normalized + source.slice(card.end);
}
