import { useRef } from "react";
import type { PointerEvent } from "react";
import type { WindowPosition } from "../types/tactical.types";

interface UseWindowDragProps {
  position: WindowPosition;
  onPositionChange: (position: WindowPosition) => void;
  disabled?: boolean;
}

export default function useWindowDrag({
  position,
  onPositionChange,
  disabled = false,
}: UseWindowDragProps) {
  const dragStart = useRef<{
    pointerX: number;
    pointerY: number;
    windowX: number;
    windowY: number;
  } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;

    const target = event.target as HTMLElement;

    // Keep buttons and future interactive content usable.
    if (
      target.closest(
        "button, input, select, textarea, a, canvas, [data-no-drag]"
      )
    ) {
      return;
    }

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      windowX: position.x,
      windowY: position.y,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;

    const start = dragStart.current;

    onPositionChange({
      x: Math.max(0, start.windowX + event.clientX - start.pointerX),
      y: Math.max(0, start.windowY + event.clientY - start.pointerY),
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}