import type { CanvasData, CanvasNode } from "./canvas/types";
import type { MarkdownCard } from "./markdownCards";

const CARD_WIDTH = 336;
const CARD_MIN_HEIGHT = 168;
const COLUMN_GAP = 96;
const ROW_GAP = 56;

function cardHeight(markdown: string): number {
  const lines = markdown.split(/\r?\n/).length;
  return Math.max(CARD_MIN_HEIGHT, 88 + lines * 22);
}

/** Create a readable deterministic board before user layout metadata exists. */
export function markdownCardsToCanvas(cards: readonly MarkdownCard[]): CanvasData {
  const roots = new Map<string | null, MarkdownCard[]>();
  for (const card of cards) {
    const siblings = roots.get(card.parentId) ?? [];
    siblings.push(card);
    roots.set(card.parentId, siblings);
  }

  const nodes: CanvasNode[] = [];
  let nextY = 0;
  const place = (card: MarkdownCard, depth: number): void => {
    const height = cardHeight(card.markdown);
    const y = nextY;
    nextY += height + ROW_GAP;
    nodes.push({
      id: card.id,
      type: "text",
      text: card.markdown,
      x: depth * (CARD_WIDTH + COLUMN_GAP),
      y,
      width: CARD_WIDTH,
      height,
    });
    for (const child of roots.get(card.id) ?? []) place(child, depth + 1);
  };

  for (const root of roots.get(null) ?? []) place(root, 0);

  return {
    nodes,
    edges: cards.flatMap((card) =>
      card.parentId
        ? [
            {
              id: `edge-${card.id}`,
              fromNode: card.parentId,
              fromSide: "right" as const,
              toNode: card.id,
              toSide: "left" as const,
            },
          ]
        : [],
    ),
  };
}
