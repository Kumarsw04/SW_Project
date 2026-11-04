import { useState } from "react";
import type { FloorId } from "../types/building.types";

export default function useFloorSelection() {
  const [selectedFloors, setSelectedFloors] = useState<FloorId[]>([]);
  const [multiSelect, setMultiSelect] = useState(false);

  const toggleFloor = (floorId: FloorId) => {
    setSelectedFloors((previous) => {
      if (multiSelect) {
        return previous.includes(floorId)
          ? previous.filter((id) => id !== floorId)
          : [...previous, floorId];
      }

      return previous.includes(floorId) ? [] : [floorId];
    });
  };

  const toggleMultiSelect = () => {
    setMultiSelect((previous) => !previous);
    setSelectedFloors([]);
  };

  return {
    selectedFloors,
    multiSelect,
    toggleFloor,
    toggleMultiSelect,
  };
}