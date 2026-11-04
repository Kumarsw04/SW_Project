import type { ApplianceData } from "../../Building3D/types/building.types";
import type { TacticalWindowData } from "../types/tactical.types";

import FloatingWindow from "./FloatingWindow";
import ApplianceWindow from "./ApplianceWindow";

interface WindowManagerProps {
  windows: TacticalWindowData[];
  appliances: ApplianceData[];
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

export default function WindowManager({
  windows,
  appliances,
  onPositionChange,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onDropOnWindow,
}: WindowManagerProps) {
  return (
    <>
      {windows.map((window) => {
        const appliance = appliances.find(
          (item) => item.id === window.applianceId
        );

        if (!appliance) return null;

        return (
          <FloatingWindow
            key={window.id}
            window={window}
            title={appliance.name}
            onPositionChange={onPositionChange}
            onFocus={onFocus}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            onClose={onClose}
            onDropOnWindow={onDropOnWindow}
          >
            <ApplianceWindow appliance={appliance} />
          </FloatingWindow>
        );
      })}
    </>
  );
}