import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import BuildingModel from "./BuildingModel";

import type {
  FloorData,
  FloorId,
} from "./types/building.types";

interface BuildingCanvasProps {
  floors: FloorData[];
  selectedFloors: FloorId[];
  onFloorClick: (floorId: FloorId) => void;

  selectedApplianceIds: string[];
  onApplianceClick: (applianceId: string) => void;
  onApplianceDoubleClick: (applianceId: string) => void;

  onEmptySpaceClick: () => void;
}

export default function BuildingCanvas({
  floors,
  selectedFloors,
  onFloorClick,
  selectedApplianceIds,
  onApplianceClick,
  onApplianceDoubleClick,
  onEmptySpaceClick,
}: BuildingCanvasProps) {
  return (
    <Canvas
      camera={{
        position: [8, 7, 9],
        fov: 45,
      }}
      onPointerMissed={onEmptySpaceClick}
      style={{
        width: "100%",
        height: "500px",
        background: "#15191c",
      }}
    >
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[8, 10, 5]}
        intensity={2}
        castShadow
      />

      <Environment preset="city" />

      <BuildingModel
        floors={floors}
        selectedFloors={selectedFloors}
        onFloorClick={onFloorClick}
        selectedApplianceIds={selectedApplianceIds}
        onApplianceClick={onApplianceClick}
        onApplianceDoubleClick={onApplianceDoubleClick}
      />

      <OrbitControls
        enablePan
        enableZoom
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />

      <gridHelper
        args={[20, 20, "#475569", "#263238"]}
        position={[0, -0.1, 0]}
      />
    </Canvas>
  );
}