import { describe, expect, it } from "vitest";
import { parseCanvas } from "./canvas/parse";
import { serializeCanvas } from "./canvas/serialize";
import { parseMarkdownCards } from "./markdownCards";
import { markdownCardsToCanvas } from "./markdownCardsCanvas";

describe("markdownCardsToCanvas", () => {
  it("maps cards to editable text nodes and hierarchy edges", () => {
    const cards = parseMarkdownCards("# Root\nintro\n## Child\nbody\n### Leaf\nmore");
    const canvas = markdownCardsToCanvas(cards);

    expect(canvas.nodes.map((node) => node.id)).toEqual(cards.map((card) => card.id));
    expect(canvas.nodes.map((node) => node.type)).toEqual(["text", "text", "text"]);
    expect(canvas.edges).toHaveLength(2);
    expect(canvas.edges[0]).toMatchObject({
      fromNode: cards[0].id,
      toNode: cards[1].id,
      fromSide: "right",
      toSide: "left",
    });
    expect(canvas.nodes[1].x).toBeGreaterThan(canvas.nodes[0].x);
    expect(canvas.nodes[2].x).toBeGreaterThan(canvas.nodes[1].x);
  });

  it("keeps a root and child with the component fixture", () => {
    const cards = parseMarkdownCards("# Original\nold body\n## Keep\nuntouched");
    const canvas = markdownCardsToCanvas(cards);
    expect(canvas.nodes).toHaveLength(2);
    expect(parseCanvas(serializeCanvas(canvas)).nodes).toHaveLength(2);
  });

  it("keeps the next card below a tall preceding card", () => {
    const body = Array.from({ length: 12 }, (_, index) => `line ${index}`).join("\n");
    const canvas = markdownCardsToCanvas(parseMarkdownCards(`# Tall\n${body}\n# Next`));
    const [tall, next] = canvas.nodes;

    expect(next.y).toBeGreaterThanOrEqual(tall.y + tall.height);
  });
});
