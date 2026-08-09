import type { PointerEvent as ReactPointerEvent } from "react";
import type { NodeSide } from "@/lib/canvas/types";

const SIDES: readonly NodeSide[] = ["top", "right", "bottom", "left"];

interface CanvasNodeChromeProps {
  onConnectStart: (side: NodeSide, e: ReactPointerEvent) => void;
  onResizeStart: (e: ReactPointerEvent) => void;
  allowConnect?: boolean;
  allowResize?: boolean;
}

/** Handles on a selected node: four side connectors for drawing edges and a
 *  bottom-right resize grip. They hang outside the node border, so the node
 *  itself is never clipped. */
export function CanvasNodeChrome({
  onConnectStart,
  onResizeStart,
  allowConnect = true,
  allowResize = true,
}: CanvasNodeChromeProps) {
  return (
    <>
      {allowConnect &&
        SIDES.map((side) => (
          <span
            key={side}
            className="glyph-canvas-connector"
            data-side={side}
            onPointerDown={(e) => {
              e.stopPropagation();
              onConnectStart(side, e);
            }}
          />
        ))}
      {allowResize && (
        <span
          className="glyph-canvas-resize"
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizeStart(e);
          }}
        />
      )}
    </>
  );
}
