import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseCanvas } from "@/lib/canvas/parse";
import { serializeCanvas } from "@/lib/canvas/serialize";
import { parseMarkdownCards } from "@/lib/markdownCards";
import { MarkdownCardsPane } from "./MarkdownCardsPane";

const metadataMock = vi.hoisted(() => ({
  loadFailed: false,
  save: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/hooks/useCardsMetadata", () => ({
  useCardsMetadata: () => ({
    metadata: null,
    loadFailed: metadataMock.loadFailed,
    save: metadataMock.save,
  }),
}));

vi.mock("@/components/canvas/lazyCanvas", () => ({
  CanvasEditor: ({ content, onChange }: { content: string; onChange: (value: string) => void }) => {
    const canvas = parseCanvas(content);
    return (
      <div>
        <span data-testid="projected-text">
          {canvas.nodes.flatMap((node) => (node.type === "text" ? [node.text] : [])).join("|")}
        </span>
        <button
          type="button"
          data-testid="cards-canvas"
          onClick={() => {
            const first = canvas.nodes[0];
            if (first?.type !== "text") return;
            onChange(
              serializeCanvas({
                ...canvas,
                nodes: [{ ...first, text: "# Renamed\nnew body\n" }, ...canvas.nodes.slice(1)],
              }),
            );
          }}
        >
          edit
        </button>
        <button
          type="button"
          data-testid="move-card"
          onClick={() => {
            const first = canvas.nodes[0];
            if (!first) return;
            onChange(
              serializeCanvas({
                ...canvas,
                nodes: [{ ...first, x: first.x + 100 }, ...canvas.nodes.slice(1)],
              }),
            );
          }}
        >
          move
        </button>
      </div>
    );
  },
}));

describe("MarkdownCardsPane", () => {
  beforeEach(() => {
    metadataMock.loadFailed = false;
    metadataMock.save.mockClear();
  });

  it("shows an empty state when the document has no headings", () => {
    render(<MarkdownCardsPane content="plain text" filePath="/note.md" onChange={vi.fn()} />);
    expect(screen.getByText("No headings to show as cards.")).toBeInTheDocument();
  });

  it("commits a targeted card edit back to Markdown", () => {
    const onChange = vi.fn();
    expect(parseMarkdownCards("# Original\nold body\n## Keep\nuntouched")).toHaveLength(2);
    render(
      <MarkdownCardsPane
        content={"# Original\nold body\n## Keep\nuntouched"}
        filePath="/note.md"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByTestId("cards-canvas"));
    expect(onChange).toHaveBeenCalledWith("# Renamed\nnew body\n## Keep\nuntouched");
  });

  it("persists a layout-only move without changing Markdown", () => {
    const onChange = vi.fn();
    render(<MarkdownCardsPane content="# One\nbody" filePath="/note.md" onChange={onChange} />);

    fireEvent.click(screen.getByTestId("move-card"));
    expect(metadataMock.save).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("gives the absolutely positioned canvas a flex sizing context", () => {
    render(<MarkdownCardsPane content="# One" filePath="/note.md" onChange={vi.fn()} />);
    expect(screen.getByTestId("markdown-cards-pane")).toHaveClass("flex", "flex-col", "flex-1");
  });

  it("reprojects the current Markdown when source content changes", () => {
    const { rerender } = render(
      <MarkdownCardsPane content="# Before" filePath="/note.md" onChange={vi.fn()} />,
    );
    expect(screen.getByTestId("projected-text")).toHaveTextContent("# Before");

    rerender(<MarkdownCardsPane content="# After" filePath="/note.md" onChange={vi.fn()} />);
    expect(screen.getByTestId("projected-text")).toHaveTextContent("# After");
  });

  it("shows a non-blocking warning when saved layout is corrupt", () => {
    metadataMock.loadFailed = true;
    render(<MarkdownCardsPane content="# One" filePath="/note.md" onChange={vi.fn()} />);
    expect(screen.getByText(/saved card positions could not be loaded/i)).toBeInTheDocument();
    expect(screen.getByTestId("cards-canvas")).toBeInTheDocument();
  });
});
