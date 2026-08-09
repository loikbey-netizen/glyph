import { describe, expect, it } from "vitest";
import type { CanvasData } from "./canvas/types";
import { applyCardsMetadata, cardsMetadataFromCanvas, parseCardsMetadata } from "./cardsMetadata";

const canvas: CanvasData = {
  nodes: [
    { id: "card-1234abcd", type: "text", text: "# Private", x: 1, y: 2, width: 3, height: 4 },
  ],
  edges: [],
};

describe("Cards metadata", () => {
  it("stores geometry only and never duplicates card text", () => {
    const metadata = cardsMetadataFromCanvas(canvas);
    const serialized = JSON.stringify(metadata);
    expect(serialized).not.toContain("Private");
    expect(metadata.nodes["card-1234abcd"]).toEqual({ x: 1, y: 2, width: 3, height: 4 });
  });

  it("applies known layouts without changing content or edges", () => {
    const updated = applyCardsMetadata(canvas, {
      version: 1,
      nodes: { "card-1234abcd": { x: 100, y: 200, width: 300, height: 180 } },
    });
    expect(updated.nodes[0]).toMatchObject({
      text: "# Private",
      x: 100,
      y: 200,
      width: 300,
      height: 180,
    });
    expect(updated.edges).toBe(canvas.edges);
  });

  it("rejects unknown fields, invalid ids, and non-finite geometry", () => {
    expect(
      parseCardsMetadata('{"version":1,"nodes":{"raw":{"x":1,"y":2,"width":3,"height":4}}}'),
    ).toBeNull();
    expect(
      parseCardsMetadata(
        '{"version":1,"nodes":{"card-1234abcd":{"x":1,"y":2,"width":3,"height":4,"text":"copy"}}}',
      ),
    ).toBeNull();
    expect(
      parseCardsMetadata(
        '{"version":1,"nodes":{"card-1234abcd":{"x":1,"y":2,"width":0,"height":4}}}',
      ),
    ).toBeNull();
    expect(parseCardsMetadata('{"version":1,"nodes":{},"source":"copied"}')).toBeNull();
    expect(parseCardsMetadata('{"version":1,"nodes":[]}')).toBeNull();
  });
});
