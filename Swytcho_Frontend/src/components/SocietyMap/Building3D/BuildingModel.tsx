
import Floor from "./Floor";

import type {
  FloorData,
  FloorId,
} from "./types/building.types";

interface BuildingModelProps {
  floors: FloorData[];
  selectedFloors: FloorId[];
  onFloorClick: (floorId: FloorId) => void;

  selectedApplianceIds: string[];
  onApplianceClick: (applianceId: string) => void;
  onApplianceDoubleClick: (applianceId: string) => void;
}

export default function BuildingModel({
  floors,
  selectedFloors,
  onFloorClick,
  selectedApplianceIds,
  onApplianceClick,
  onApplianceDoubleClick,
}: BuildingModelProps) {
  return (
    <group>
      {floors.map((floor) => (
        <Floor
          key={floor.id}
          floor={floor}
          selected={selectedFloors.includes(floor.id)}
          onClick={() => onFloorClick(floor.id)}
          selectedApplianceIds={selectedApplianceIds}
          onApplianceClick={onApplianceClick}
          onApplianceDoubleClick={onApplianceDoubleClick}
        />
      ))}
    </group>
  );
}
