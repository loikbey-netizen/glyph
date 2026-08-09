import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CanvasEditor } from "@/components/canvas/lazyCanvas";
import { useCardsMetadata } from "@/hooks/useCardsMetadata";
import { parseCanvas } from "@/lib/canvas/parse";
import { serializeCanvas } from "@/lib/canvas/serialize";
import { applyCardsMetadata } from "@/lib/cardsMetadata";
import { parseMarkdownCards, replaceMarkdownCard } from "@/lib/markdownCards";
import { markdownCardsToCanvas } from "@/lib/markdownCardsCanvas";

interface MarkdownCardsPaneProps {
  content: string;
  filePath: string;
  onChange: (nextMarkdown: string) => void;
}

const CARDS_CAPABILITIES = {
  create: false,
  delete: false,
  connect: false,
  recolor: false,
  editText: true,
  resize: true,
} as const;

export function MarkdownCardsPane({ content, filePath, onChange }: MarkdownCardsPaneProps) {
  const { t } = useTranslation("common");
  const [error, setError] = useState<string | null>(null);
  const { metadata, loadFailed, save: saveMetadata } = useCardsMetadata(filePath);
  const cards = useMemo(() => parseMarkdownCards(content), [content]);
  const canvasContent = useMemo(
    () => serializeCanvas(applyCardsMetadata(markdownCardsToCanvas(cards), metadata)),
    [cards, metadata],
  );

  const handleCanvasChange = useCallback(
    (serialized: string) => {
      const nextCanvas = parseCanvas(serialized);
      void saveMetadata(nextCanvas);
      const textById = new Map(
        nextCanvas.nodes.flatMap((node) => (node.type === "text" ? [[node.id, node.text]] : [])),
      );
      const changed = cards.filter((card) => textById.get(card.id) !== card.markdown);

      // Geometry-only changes are persisted outside the Markdown source by the
      // dedicated Cards metadata layer.
      if (changed.length === 0) return;
      if (changed.length > 1) {
        setError(t("cards.concurrentEditError"));
        return;
      }

      const card = changed[0];
      const nextText = textById.get(card.id);
      if (nextText === undefined) return;
      try {
        setError(null);
        onChange(replaceMarkdownCard(content, card, nextText));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : t("cards.editError"));
      }
    },
    [cards, content, onChange, saveMetadata, t],
  );

  if (cards.length === 0) {
    return <div className="flex-1 grid place-items-center text-secondary">{t("cards.empty")}</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden" data-testid="markdown-cards-pane">
      {loadFailed && <div className="workspace-banner">{t("cards.metadataWarning")}</div>}
      {error && (
        <div role="alert" className="workspace-banner">
          {error}
        </div>
      )}
      <CanvasEditor
        content={canvasContent}
        filePath={filePath}
        onChange={handleCanvasChange}
        viewportKey={`cards:${filePath}`}
        capabilities={CARDS_CAPABILITIES}
      />
    </div>
  );
}
