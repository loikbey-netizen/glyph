import { describe, expect, it } from "vitest";
import { parseMarkdownCards, replaceMarkdownCard } from "./markdownCards";

describe("parseMarkdownCards", () => {
  it("projects each ATX heading and its direct content into one hierarchical card", () => {
    const source = [
      "preamble",
      "# Product",
      "intro",
      "## Principles",
      "direct principles",
      "### Local first",
      "details",
      "## Limits",
      "outro",
    ].join("\n");

    const cards = parseMarkdownCards(source);

    expect(cards.map(({ level, title, markdown }) => ({ level, title, markdown }))).toEqual([
      { level: 1, title: "Product", markdown: "# Product\nintro\n" },
      { level: 2, title: "Principles", markdown: "## Principles\ndirect principles\n" },
      { level: 3, title: "Local first", markdown: "### Local first\ndetails\n" },
      { level: 2, title: "Limits", markdown: "## Limits\noutro" },
    ]);
    expect(cards[0].parentId).toBeNull();
    expect(cards[1].parentId).toBe(cards[0].id);
    expect(cards[2].parentId).toBe(cards[1].id);
    expect(cards[3].parentId).toBe(cards[0].id);
  });

  it("omits preamble-only documents and ignores headings inside fences", () => {
    expect(parseMarkdownCards("plain text only")).toEqual([]);
    expect(parseMarkdownCards("# Real\n```md\n## Not a card\n```\ntext")).toHaveLength(1);
  });

  it("returns exact UTF-16 source offsets and preserves CRLF", () => {
    const source = "préface\r\n# Un\r\nbody\r\n## Deux\r\nfin\r\n";
    const cards = parseMarkdownCards(source);

    expect(source.slice(cards[0].start, cards[0].end)).toBe("# Un\r\nbody\r\n");
    expect(source.slice(cards[1].start, cards[1].end)).toBe("## Deux\r\nfin\r\n");
    expect(cards[0].original).toBe(cards[0].markdown);
  });

  it("generates deterministic opaque ids", () => {
    const source = "# One\ntext\n## Two\ntext";
    const first = parseMarkdownCards(source).map((card) => card.id);
    const second = parseMarkdownCards(source).map((card) => card.id);

    expect(second).toEqual(first);
    expect(first.every((id) => /^card-[0-9a-f]{8}$/.test(id))).toBe(true);
  });

  it("splits a two-heading document at the second heading", () => {
    const cards = parseMarkdownCards("# Original\nold body\n## Keep\nuntouched");
    expect(cards.map((card) => card.markdown)).toEqual([
      "# Original\nold body\n",
      "## Keep\nuntouched",
    ]);
  });
});

describe("replaceMarkdownCard", () => {
  it("replaces only the targeted card and preserves unrelated source byte-for-byte", () => {
    const source = "preface\n# One\nold\n## Two\nkeep\n";
    const [card] = parseMarkdownCards(source);

    expect(replaceMarkdownCard(source, card, "# One renamed\nnew\n")).toBe(
      "preface\n# One renamed\nnew\n## Two\nkeep\n",
    );
  });

  it("normalizes edited card line endings to the document convention", () => {
    const source = "# One\r\nold\r\n## Two\r\nkeep\r\n";
    const [card] = parseMarkdownCards(source);

    expect(replaceMarkdownCard(source, card, "# One\nnew\n")).toBe(
      "# One\r\nnew\r\n## Two\r\nkeep\r\n",
    );
  });

  it("rejects stale offsets instead of overwriting a changed document", () => {
    const source = "# One\nold";
    const [card] = parseMarkdownCards(source);

    expect(() => replaceMarkdownCard("prefix\n# One\nold", card, "# One\nnew")).toThrow(
      /changed externally/i,
    );
  });

  it("allows a heading rename or level change and reparses the hierarchy", () => {
    const source = "## One\nold";
    const [card] = parseMarkdownCards(source);

    const updated = replaceMarkdownCard(source, card, "# Renamed\nnew");
    expect(updated).toBe("# Renamed\nnew");
    expect(parseMarkdownCards(updated)[0]).toMatchObject({ level: 1, title: "Renamed" });
  });

  it("rejects edits that remove the heading", () => {
    const source = "## One\nold";
    const [card] = parseMarkdownCards(source);

    expect(() => replaceMarkdownCard(source, card, "plain text")).toThrow(/heading/i);
  });
});
