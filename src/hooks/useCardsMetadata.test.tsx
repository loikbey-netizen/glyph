import { invoke } from "@tauri-apps/api/core";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CanvasData } from "@/lib/canvas/types";
import { useCardsMetadata } from "./useCardsMetadata";

const canvas = (x: number): CanvasData => ({
  nodes: [
    {
      id: "card-1234abcd",
      type: "text",
      text: "# Source remains elsewhere",
      x,
      y: 2,
      width: 300,
      height: 180,
    },
  ],
  edges: [],
});

describe("useCardsMetadata", () => {
  beforeEach(() => {
    vi.mocked(invoke).mockReset();
  });

  it("loads metadata for the current document", async () => {
    vi.mocked(invoke).mockResolvedValue(
      '{"version":1,"nodes":{"card-1234abcd":{"x":10,"y":20,"width":300,"height":180}}}',
    );
    const { result } = renderHook(() => useCardsMetadata("D:\\notes\\one.md"));

    await waitFor(() => expect(result.current.metadata?.nodes["card-1234abcd"].x).toBe(10));
    expect(invoke).toHaveBeenCalledWith("read_cards_metadata", {
      documentPath: "D:\\notes\\one.md",
    });
    expect(result.current.loadFailed).toBe(false);
  });

  it("falls back to deterministic layout and reports corrupt metadata", async () => {
    vi.mocked(invoke).mockResolvedValue('{"version":1,"nodes":"broken"}');
    const { result } = renderHook(() => useCardsMetadata("D:\\notes\\broken.md"));

    await waitFor(() => expect(result.current.loadFailed).toBe(true));
    expect(result.current.metadata).toBeNull();
  });

  it("serializes rapid layout writes so an older write cannot finish last", async () => {
    let finishFirstWrite: (() => void) | undefined;
    const firstWrite = new Promise<void>((resolve) => {
      finishFirstWrite = resolve;
    });
    let writeCount = 0;
    vi.mocked(invoke).mockImplementation((command) => {
      if (command === "read_cards_metadata") return Promise.resolve(null);
      writeCount += 1;
      return writeCount === 1 ? firstWrite : Promise.resolve();
    });
    const { result, unmount } = renderHook(() => useCardsMetadata("D:\\notes\\one.md"));
    await waitFor(() =>
      expect(invoke).toHaveBeenCalledWith("read_cards_metadata", expect.anything()),
    );

    let firstSave: Promise<void> | undefined;
    let secondSave: Promise<void> | undefined;
    act(() => {
      firstSave = result.current.save(canvas(10));
      secondSave = result.current.save(canvas(20));
    });

    await waitFor(() => expect(writeCount).toBe(1));
    expect(
      vi.mocked(invoke).mock.calls.filter(([command]) => command === "write_cards_metadata"),
    ).toHaveLength(1);

    // The process-level queue owns accepted writes even after the view unmounts.
    unmount();

    finishFirstWrite?.();
    await act(async () => {
      await Promise.all([firstSave, secondSave]);
    });

    const writes = vi
      .mocked(invoke)
      .mock.calls.filter(([command]) => command === "write_cards_metadata");
    expect(writes).toHaveLength(2);
    expect(writes[1][1]).toMatchObject({ payload: expect.stringContaining('"x":20') });
    expect(writes[1][1]).toMatchObject({ payload: expect.not.stringContaining("Source remains") });
  });

  it("does not let a late initial read overwrite a newer local move", async () => {
    let finishRead: ((payload: string) => void) | undefined;
    const pendingRead = new Promise<string>((resolve) => {
      finishRead = resolve;
    });
    vi.mocked(invoke).mockImplementation((command) =>
      command === "read_cards_metadata" ? pendingRead : Promise.resolve(),
    );
    const { result } = renderHook(() => useCardsMetadata("D:\\notes\\one.md"));

    act(() => {
      void result.current.save(canvas(20));
    });
    finishRead?.('{"version":1,"nodes":{"card-1234abcd":{"x":10,"y":2,"width":300,"height":180}}}');

    await waitFor(() => expect(result.current.metadata?.nodes["card-1234abcd"].x).toBe(20));
  });
});
