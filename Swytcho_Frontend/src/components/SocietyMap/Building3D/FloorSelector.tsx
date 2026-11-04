import type { FloorData, FloorId } from "./types/building.types";

interface FloorSelectorProps {
  floors: FloorData[];
  selectedFloors: FloorId[];
  multiSelect: boolean;
  onToggleFloor: (floorId: FloorId) => void;
  onToggleMultiSelect: () => void;
}

export default function FloorSelector({
  floors,
  selectedFloors,
  multiSelect,
  onToggleFloor,
  onToggleMultiSelect,
}: FloorSelectorProps) {
  return (
    <div className="floor-selector">
      <div className="floor-selector-heading">
        <h3>Select Floors</h3>

        <button
          type="button"
          className={multiSelect ? "active" : ""}
          onClick={onToggleMultiSelect}
        >
          {multiSelect ? "Multi-select ON" : "Multi-select OFF"}
        </button>
      </div>

      <div className="floor-selector-options">
        {floors.map((floor) => {
          const isSelected = selectedFloors.includes(floor.id);

          return (
            <button
              key={floor.id}
              type="button"
              className={`floor-option ${isSelected ? "selected" : ""}`}
              onClick={() => onToggleFloor(floor.id)}
            >
              <span>{floor.name}</span>
              <small>
                {isSelected ? "Selected" : "Select"}
              </small>
            </button>
          );
        })}
      </div>
    </div>
  );
}