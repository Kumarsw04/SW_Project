import { useMemo, useState } from "react";

import BuildingCanvas from "./Building3D/BuildingCanvas";
import FloorSelector from "./Building3D/FloorSelector";
import useFloorSelection from "./Building3D/hooks/useFloorSelection";

import TacticalWorkspace from "./TacticalWorkspace/TacticalWorkspace";

import type { FloorData } from "./Building3D/types/building.types";

import { createDemoAppliances } from "./Building3D/data/buildingMockData";

import BuildingLoginDemo from "./BuildingLoginDemo";

import "./SocietyMap.css";

const FLOORS: FloorData[] = [
  { id: "ground", name: "Ground Floor", level: 0, height: 1.8 },
  { id: "first", name: "First Floor", level: 1, height: 1.8 },
  { id: "second", name: "Second Floor", level: 2, height: 1.8 },
];

export default function SocietyMap() {
  const {
    selectedFloors,
    multiSelect,
    toggleFloor,
    toggleMultiSelect,
  } = useFloorSelection();

  const [selectedAppliances, setSelectedAppliances] =
    useState<Set<string>>(new Set());

  const [multiApplianceMode, setMultiApplianceMode] = useState(false);

  const allAppliances = useMemo(
    () => FLOORS.flatMap((floor) => createDemoAppliances(floor.id)),
    []
  );

  // Single-click: select one or toggle an appliance in multi-selection mode.
  const handleApplianceClick = (id: string) => {
    if (multiApplianceMode) {
      setSelectedAppliances((previous) => {
        const updated = new Set(previous);

        if (updated.has(id)) {
          updated.delete(id);
        } else {
          updated.add(id);
        }

        return updated;
      });
    } else {
      setSelectedAppliances(new Set([id]));
    }
  };

  // Double-click: enable multi-selection.
  const handleApplianceDoubleClick = (id: string) => {
    setMultiApplianceMode(true);

    setSelectedAppliances((previous) =>
      new Set([...previous, id])
    );
  };

  const clearApplianceSelection = () => {
    setSelectedAppliances(new Set());
    setMultiApplianceMode(false);
  };

  // Close an individual window and remove its appliance selection.
  const handleCloseAppliance = (id: string) => {
    setSelectedAppliances((previous) => {
      const updated = new Set(previous);
      updated.delete(id);

      if (updated.size === 0) {
        setMultiApplianceMode(false);
      }

      return updated;
    });
  };

  return (
    <main className="society-map-page">
      <header className="society-map-header">
        <div>
          <h1>Society Building</h1>
          <p>
            Explore floors and monitor your building's electrical system.
          </p>
        </div>

        <span className="building-status">3 Floors</span>
      </header>

      <FloorSelector
        floors={FLOORS}
        selectedFloors={selectedFloors}
        multiSelect={multiSelect}
        onToggleFloor={toggleFloor}
        onToggleMultiSelect={toggleMultiSelect}
      />
      <section className="building-view-panel">
        <div className="building-view-heading">
          <h2>Building Assignment Login</h2>
          <span>Excel-based building access</span>
        </div>

        <div className="building-login-stage">
          <BuildingLoginDemo />
        </div>
      </section>

      <section className="building-view-panel">
        <div className="building-view-heading">
          <h2>3D Building View</h2>

          <span>
            {selectedFloors.length} floor(s) selected
          </span>
        </div>

        <div className="building-canvas-stage">
          <BuildingCanvas
            floors={FLOORS}
            selectedFloors={selectedFloors}
            onFloorClick={toggleFloor}
            selectedApplianceIds={Array.from(selectedAppliances)}
            onApplianceClick={handleApplianceClick}
            onApplianceDoubleClick={handleApplianceDoubleClick}
            onEmptySpaceClick={clearApplianceSelection}
          />
          <TacticalWorkspace
            appliances={allAppliances}
            selectedApplianceIds={Array.from(selectedAppliances)}
            onCloseAppliance={handleCloseAppliance}
            onClearAll={clearApplianceSelection}
          />
        </div>
      </section>
    </main>
  );
}