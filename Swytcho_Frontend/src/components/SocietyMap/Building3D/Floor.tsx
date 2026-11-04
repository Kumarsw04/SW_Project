
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import type { Group } from "three";

import Room from "./Room";
import Appliance from "./Appliance";

import type { FloorData } from "./types/building.types";

import {
  DEMO_ROOMS,
  createDemoAppliances,
} from "./data/buildingMockData";

interface FloorProps {
  floor: FloorData;
  selected: boolean;
  onClick: () => void;
  selectedApplianceIds: string[];
  onApplianceClick: (applianceId: string) => void;
  onApplianceDoubleClick: (applianceId: string) => void;
}

export default function Floor({
  floor,
  selected,
  onClick,
  selectedApplianceIds,
  onApplianceClick,
  onApplianceDoubleClick,
}: FloorProps) {
  const floorRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!floorRef.current) return;

    const targetY =
      floor.level * 2.4 + (selected ? 0.6 : 0);

    floorRef.current.position.y +=
      (targetY - floorRef.current.position.y) *
      Math.min(delta * 5, 1);
  });

  const appliances = createDemoAppliances(floor.id);

  return (
    <group
      ref={floorRef}
      position={[0, floor.level * 2.4, 0]}
    >
      <Box
        args={[6, 0.16, 6]}
        position={[0, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
      >
        <meshStandardMaterial
          color="#64748b"
          roughness={0.7}
        />
      </Box>

      {DEMO_ROOMS.map((room) => (
        <Room
          key={room.id}
          room={room}
          selected={selected}
        />
      ))}

      <Box args={[6, 1.1, 0.15]} position={[0, 0.63, -3]}>
        <meshStandardMaterial color="#a5b4c7" />
      </Box>

      <Box args={[6, 1.1, 0.15]} position={[0, 0.63, 3]}>
        <meshStandardMaterial color="#a5b4c7" />
      </Box>

      <Box args={[0.15, 1.1, 6]} position={[-3, 0.63, 0]}>
        <meshStandardMaterial color="#a5b4c7" />
      </Box>

      <Box args={[0.15, 1.1, 6]} position={[3, 0.63, 0]}>
        <meshStandardMaterial color="#a5b4c7" />
      </Box>

      {/* Interior partitions */}
      <Box args={[0.12, 1.1, 6]} position={[0, 0.63, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>

      <Box args={[3, 1.1, 0.12]} position={[-1.5, 0.63, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>

      <Box args={[3, 1.1, 0.12]} position={[1.5, 0.63, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>

      <Box args={[1.5, 1.1, 0.12]} position={[2.25, 0.63, 1.25]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>

      <Box args={[0.12, 1.1, 1.5]} position={[2.25, 0.63, 2.25]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>

      {/* Appliances */}
      {appliances.map((appliance) => (
        <Appliance
          key={appliance.id}
          appliance={appliance}
          selected={selectedApplianceIds.includes(appliance.id)}
          onClick={onApplianceClick}
          onDoubleClick={onApplianceDoubleClick}
        />
      ))}
    </group>
  );
}
