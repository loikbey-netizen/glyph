import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CanvasData } from "@/lib/canvas/types";
import {
  type CardsMetadata,
  cardsMetadataFromCanvas,
  parseCardsMetadata,
} from "@/lib/cardsMetadata";
import { enqueueCardsMetadataWrite } from "@/lib/cardsMetadataPersistence";

export function useCardsMetadata(documentPath: string) {
  const [metadata, setMetadata] = useState<CardsMetadata | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const loadToken = useRef(0);

  useEffect(() => {
    const token = ++loadToken.current;
    let cancelled = false;
    setMetadata(null);
    setLoadFailed(false);
    invoke<string | null>("read_cards_metadata", { documentPath })
      .then((payload) => {
        if (!cancelled && token === loadToken.current) {
          const parsed = parseCardsMetadata(payload);
          setMetadata(parsed);
          setLoadFailed(payload !== null && parsed === null);
        }
      })
      .catch(() => {
        if (!cancelled && token === loadToken.current) {
          setMetadata(null);
          setLoadFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [documentPath]);

  const save = useCallback(
    (canvas: CanvasData) => {
      // A local move made before the initial read completes is newer than the
      // stored layout, so invalidate that pending read before updating state.
      loadToken.current += 1;
      const next = cardsMetadataFromCanvas(canvas);
      setMetadata(next);
      const payload = JSON.stringify(next);
      return enqueueCardsMetadataWrite(documentPath, payload);
    },
    [documentPath],
  );

  return { metadata, loadFailed, save };
}
