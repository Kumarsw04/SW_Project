import { useEffect, useRef, useState } from "react";

import type { ApplianceData } from "../Building3D/types/building.types";

import useTacticalWindows from "./hooks/useTacticalWindows";
import WindowManager from "./windows/WindowManager";

import ComparisonWorkspace, {
  type ApplianceComparison,
} from "./comparison/ComparisonWorkspace";

import ConnectionLayer from "./connectors/ConnectionLayer";

import "./TacticalWorkspace.css";

interface TacticalWorkspaceProps {
  appliances: ApplianceData[];
  selectedApplianceIds: string[];
  onCloseAppliance: (applianceId: string) => void;
  onClearAll: () => void;
}

export default function TacticalWorkspace({
  appliances,
  selectedApplianceIds,
  onCloseAppliance,
  onClearAll,
}: TacticalWorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [workspaceSize, setWorkspaceSize] = useState({
    width: 0,
    height: 0,
  });

  const {
    windows,
    syncWindows,
    updatePosition,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    closeWindow,
    clearWindows,
  } = useTacticalWindows();

  const [comparisons, setComparisons] =
    useState<ApplianceComparison[]>([]);

  useEffect(() => {
    syncWindows(selectedApplianceIds);
  }, [selectedApplianceIds, syncWindows]);

  useEffect(() => {
    const element = workspaceRef.current;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWorkspaceSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleClose = (windowId: string) => {
    const window = windows.find((item) => item.id === windowId);

    closeWindow(windowId);

    if (window) {
      onCloseAppliance(window.applianceId);

      setComparisons((previous) =>
        previous.filter(
          (comparison) =>
            comparison.firstApplianceId !== window.applianceId &&
            comparison.secondApplianceId !== window.applianceId
        )
      );
    }
  };

  const handleDropOnWindow = (
    sourceWindowId: string,
    targetWindowId: string
  ) => {
    const sourceWindow = windows.find(
      (window) => window.id === sourceWindowId
    );

    const targetWindow = windows.find(
      (window) => window.id === targetWindowId
    );

    if (!sourceWindow || !targetWindow) return;

    if (sourceWindow.applianceId === targetWindow.applianceId) return;

    const firstId = sourceWindow.applianceId;
    const secondId = targetWindow.applianceId;

    const comparisonId = [firstId, secondId].sort().join("--");

    setComparisons((previous) => {
      if (previous.some((item) => item.id === comparisonId)) {
        return previous;
      }

      return [
        ...previous,
        {
          id: comparisonId,
          firstApplianceId: firstId,
          secondApplianceId: secondId,
        },
      ];
    });

    focusWindow(sourceWindowId);
    focusWindow(targetWindowId);
  };

  const handleCloseAll = () => {
    clearWindows();
    setComparisons([]);
    onClearAll();
  };

  return (
    <div className="tactical-workspace" ref={workspaceRef}>
      {workspaceSize.width > 0 && (
        <ConnectionLayer
          windows={windows}
          comparisons={comparisons}
          stageWidth={workspaceSize.width}
          stageHeight={workspaceSize.height}
        />
      )}

      {windows.length > 0 && (
        <div className="tactical-workspace-toolbar">
          <span>
            <span className="tactical-live-dot" />
            {windows.length} appliance window(s)
            {comparisons.length > 0 &&
              ` · ${comparisons.length} comparison(s)`}
          </span>

          <button type="button" onClick={handleCloseAll}>
            Close All
          </button>
        </div>
      )}

      <WindowManager
        windows={windows}
        appliances={appliances}
        onPositionChange={updatePosition}
        onFocus={focusWindow}
        onMinimize={toggleMinimize}
        onMaximize={toggleMaximize}
        onClose={handleClose}
        onDropOnWindow={handleDropOnWindow}
      />

      <ComparisonWorkspace
        comparisons={comparisons}
        appliances={appliances}
        onClose={(comparisonId) =>
          setComparisons((previous) =>
            previous.filter((item) => item.id !== comparisonId)
          )
        }
      />
    </div>
  );
}