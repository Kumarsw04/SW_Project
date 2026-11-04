import type { ReactNode, PointerEvent } from "react";
import type { TacticalWindowData } from "../types/tactical.types";
import useWindowDrag from "../hooks/useWindowDrag";

interface FloatingWindowProps {
  window: TacticalWindowData;
  title: string;
  children: ReactNode;
  onPositionChange: (
    id: string,
    position: TacticalWindowData["position"]
  ) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onClose: (id: string) => void;
  onDropOnWindow: (sourceId: string, targetId: string) => void;
}

export default function FloatingWindow({
  window,
  title,
  children,
  onPositionChange,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onDropOnWindow,
}: FloatingWindowProps) {
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useWindowDrag({
    position: window.position,
    onPositionChange: (position) =>
      onPositionChange(window.id, position),
    disabled: window.maximized || window.minimized,
  });

  const handleDrop = (event: PointerEvent<HTMLDivElement>) => {
    handlePointerUp(event);

    const elements = document.elementsFromPoint(
      event.clientX,
      event.clientY
    );

    const target = elements
      .map((element) =>
        element.closest<HTMLElement>("[data-tactical-window-id]")
      )
      .find(
        (element) =>
          element &&
          element.dataset.tacticalWindowId !== window.id
      );

    const targetId = target?.dataset.tacticalWindowId;

    if (targetId) {
      onDropOnWindow(window.id, targetId);
    }
  };

  return (
    <div
      data-tactical-window-id={window.id}
      className={[
        "tactical-window",
        window.maximized ? "is-maximized" : "",
        window.minimized ? "is-minimized" : "",
      ].join(" ")}
      style={{
        left: window.maximized ? 12 : window.position.x,
        top: window.maximized ? 12 : window.position.y,
        zIndex: window.zIndex,
      }}
      onPointerDown={(event) => {
        onFocus(window.id);
        handlePointerDown(event);
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handleDrop}
      onLostPointerCapture={handlePointerUp}
    >
      <header className="tactical-window-header">
        <div className="tactical-window-title">
          <span className="tactical-window-indicator" />
          <strong>{title}</strong>
        </div>

        <div className="tactical-window-controls">
          <button
            type="button"
            title="Minimize"
            onClick={() => onMinimize(window.id)}
          >
            −
          </button>

          <button
            type="button"
            title="Maximize / Restore"
            onClick={() => onMaximize(window.id)}
          >
            □
          </button>

          <button
            type="button"
            title="Close"
            onClick={() => onClose(window.id)}
          >
            ×
          </button>
        </div>
      </header>

      <span
        className="tactical-connection-node"
        title="Appliance connection point"
      />

      {!window.minimized && (
        <div className="tactical-window-content">
          {children}
        </div>
      )}
    </div>
  );
}