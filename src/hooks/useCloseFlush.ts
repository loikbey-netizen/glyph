import { useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";
import { flushCardsMetadataWrites } from "@/lib/cardsMetadataPersistence";

/**
 * Compose the flushes run when a native window close is intercepted: pending
 * settings and Cards layout metadata first (their failures never block the
 * close), then dirty documents, whose result decides whether the window may
 * close.
 */
export function useCloseFlush(flushDocuments: () => Promise<boolean>) {
  const { flushSettings } = useSettings();
  return useCallback(async () => {
    await flushSettings();
    await flushCardsMetadataWrites();
    return flushDocuments();
  }, [flushSettings, flushDocuments]);
}
