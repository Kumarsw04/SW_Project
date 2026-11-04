import { useCallback, useRef, useState } from "react";
import type {
  TacticalWindowData,
  WindowPosition,
} from "../types/tactical.types";

export default function useTacticalWindows() {
  const [windows, setWindows] = useState<TacticalWindowData[]>([]);
  const highestZIndex = useRef(10);

  // Keep windows synchronized with selected appliances.
  const syncWindows = useCallback((applianceIds: string[]) => {
    setWindows((previous) => {
      const existingIds = new Set(
        previous.map((window) => window.applianceId)
      );

      const retained = previous.filter((window) =>
        applianceIds.includes(window.applianceId)
      );

      const newWindows = applianceIds
        .filter((id) => !existingIds.has(id))
        .map((id, index): TacticalWindowData => {
          highestZIndex.current += 1;

          return {
            id: `window-${id}`,
            applianceId: id,
            position: {
              x: 24 + index * 32,
              y: 24 + index * 32,
            },
            minimized: false,
            maximized: false,
            zIndex: highestZIndex.current,
          };
        });

      return [...retained, ...newWindows];
    });
  }, []);

  const updatePosition = useCallback(
    (id: string, position: WindowPosition) => {
      setWindows((previous) =>
        previous.map((window) =>
          window.id === id ? { ...window, position } : window
        )
      );
    },
    []
  );

  const focusWindow = useCallback((id: string) => {
    highestZIndex.current += 1;

    const next = highestZIndex.current;

    setWindows((previous) =>
      previous.map((window) =>
        window.id === id ? { ...window, zIndex: next } : window
      )
    );
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setWindows((previous) =>
      previous.map((window) =>
        window.id === id
          ? { ...window, minimized: !window.minimized }
          : window
      )
    );
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((previous) =>
      previous.map((window) =>
        window.id === id
          ? { ...window, maximized: !window.maximized, minimized: false }
          : window
      )
    );
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((previous) =>
      previous.filter((window) => window.id !== id)
    );
  }, []);

  const clearWindows = useCallback(() => {
    setWindows([]);
  }, []);

  return {
    windows,
    syncWindows,
    updatePosition,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    closeWindow,
    clearWindows,
  };
}