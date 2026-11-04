import { useEffect, useRef, useState } from "react";
import { Box } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Group } from "three";

import type { ApplianceData } from "./types/building.types";

import { applianceAnchorStore } from "../TacticalWorkspace/connectors/applianceAnchorStore";

interface ApplianceProps {
  appliance: ApplianceData;
  selected: boolean;
  onClick: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export default function Appliance({
  appliance,
  selected,
  onClick,
  onDoubleClick,
}: ApplianceProps) {
  const [hovered, setHovered] = useState(false);

  const groupRef = useRef<Group>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { camera, size } = useThree();

  const worldPosition = useRef(new Vector3());
  const projectedPosition = useRef(new Vector3());

  // Track the actual world position, including animated floor movement.
  useFrame(() => {
    if (!selected || !groupRef.current) return;

    groupRef.current.getWorldPosition(worldPosition.current);

    const projected = projectedPosition.current
        .copy(worldPosition.current)
        .project(camera);

    const visible =
      projected.z >= -1 &&
      projected.z <= 1 &&
      Math.abs(projected.x) <= 1 &&
      Math.abs(projected.y) <= 1;

    applianceAnchorStore.update(appliance.id, {
      x: ((projected.x + 1) / 2) * size.width,
      y: ((1 - projected.y) / 2) * size.height,
      visible,
    });
  });

  useEffect(() => {
    if (!selected) {
      applianceAnchorStore.remove(appliance.id);
    }

    return () => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }

      applianceAnchorStore.remove(appliance.id);
      document.body.style.cursor = "auto";
    };
  }, [appliance.id, selected]);

  const handleClick = (event: any) => {
    event.stopPropagation();

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onDoubleClick(appliance.id);
      return;
    }

    clickTimer.current = setTimeout(() => {
      onClick(appliance.id);
      clickTimer.current = null;
    }, 250);
  };

  return (
    <group ref={groupRef} position={appliance.position}>
      <Box
        args={[0.35, 0.35, 0.35]}
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <meshStandardMaterial
          color={
            selected
              ? "#e8c578"
              : hovered
                ? "#8ca8c8"
                : "#64748b"
          }
          metalness={0.4}
          roughness={0.35}
        />
      </Box>
    </group>
  );
}