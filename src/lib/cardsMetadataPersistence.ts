import { invoke } from "@tauri-apps/api/core";

const pendingWrites = new Map<string, Promise<void>>();

export function enqueueCardsMetadataWrite(documentPath: string, payload: string): Promise<void> {
  const previous = pendingWrites.get(documentPath) ?? Promise.resolve();
  const write = previous.then(() =>
    invoke<void>("write_cards_metadata", { documentPath, payload }),
  );
  const settled = write.catch((error) => {
    console.error("Failed to save Cards metadata:", error);
  });

  pendingWrites.set(documentPath, settled);
  void settled.finally(() => {
    if (pendingWrites.get(documentPath) === settled) pendingWrites.delete(documentPath);
  });
  return settled;
}

/** Wait for every layout write already accepted by the application. */
export async function flushCardsMetadataWrites(): Promise<void> {
  while (pendingWrites.size > 0) {
    await Promise.all([...pendingWrites.values()]);
  }
}
