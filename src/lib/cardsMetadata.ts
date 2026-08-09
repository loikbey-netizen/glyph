import type { CanvasData } from "./canvas/types";

export interface CardLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CardsMetadata {
  version: 1;
  nodes: Record<string, CardLayout>;
}

function validNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseCardsMetadata(payload: string | null): CardsMetadata | null {
  if (!payload) return null;
  try {
    const raw = JSON.parse(payload) as { version?: unknown; nodes?: unknown };
    if (
      raw.version !== 1 ||
      !raw.nodes ||
      typeof raw.nodes !== "object" ||
      Array.isArray(raw.nodes) ||
      Object.keys(raw).some((key) => !["version", "nodes"].includes(key))
    ) {
      return null;
    }
    const nodes: Record<string, CardLayout> = {};
    for (const [id, value] of Object.entries(raw.nodes)) {
      if (!/^card-[0-9a-f]{8}$/.test(id) || !value || typeof value !== "object") return null;
      const layout = value as Record<string, unknown>;
      if (
        !validNumber(layout.x) ||
        !validNumber(layout.y) ||
        !validNumber(layout.width) ||
        !validNumber(layout.height) ||
        layout.width <= 0 ||
        layout.height <= 0 ||
        Object.keys(layout).some((key) => !["x", "y", "width", "height"].includes(key))
      ) {
        return null;
      }
      nodes[id] = {
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
      };
    }
    return { version: 1, nodes };
  } catch {
    return null;
  }
}

export function cardsMetadataFromCanvas(canvas: CanvasData): CardsMetadata {
  return {
    version: 1,
    nodes: Object.fromEntries(
      canvas.nodes
        .filter((node) => /^card-[0-9a-f]{8}$/.test(node.id))
        .map((node) => [node.id, { x: node.x, y: node.y, width: node.width, height: node.height }]),
    ),
  };
}

export function applyCardsMetadata(canvas: CanvasData, metadata: CardsMetadata | null): CanvasData {
  if (!metadata) return canvas;
  return {
    ...canvas,
    nodes: canvas.nodes.map((node) => {
      const layout = metadata.nodes[node.id];
      return layout ? { ...node, ...layout } : node;
    }),
  };
}
