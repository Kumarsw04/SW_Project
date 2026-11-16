import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DeviceStatus, Position3 } from "./types";
import { STATUS_COLORS } from "./types";

interface Props {
  position: Position3;
  status: DeviceStatus;
  currentFloor: 0 | 1 | 2 | 3;
  onSelect?: () => void;
  id: "lift-1" | "lift-2";
}

/** Shaft and lift car; later `currentFloor` can be driven by timed simulation. */
export default function Lift({ position, status, currentFloor, onSelect, id }: Props) {
  const liftCar = useRef<THREE.Group>(null);
  const initialY = 0.18 + currentFloor * 0.95;
  useEffect(() => {
    if (liftCar.current) liftCar.current.position.y = initialY;
  }, [initialY]);
  useFrame(({ clock }) => {
    if (liftCar.current && status === "running") {
      const phase = id === "lift-1" ? -Math.PI / 2 : Math.PI / 2;
      liftCar.current.position.y = 0.18 + 1.425 * (1 + Math.sin(clock.getElapsedTime() * 0.46 + phase));
    }
  });
  return (
    <group position={position} onClick={(event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect?.(); }} userData={{ system: id }}>
      {/* Three exposed vertical rails and a translucent shaft */}
      {[-0.21, 0.21].map((x) => (
        <mesh key={x} position={[x, 1.9, -0.13]} castShadow>
          <boxGeometry args={[0.035, 3.8, 0.045]} />
          <meshStandardMaterial color="#839aaa" metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 1.9, -0.29]}>
        <boxGeometry args={[0.5, 3.8, 0.035]} />
        <meshStandardMaterial color="#253c4d" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.9, 0.28]}>
        <boxGeometry args={[0.5, 3.8, 0.013]} />
        <meshPhysicalMaterial color="#86bbd4" transparent opacity={0.13} roughness={0.1} depthWrite={false} />
      </mesh>
      {/* Car travels between floors while running and freezes on OFF / FAULT. */}
      <group ref={liftCar}>
        <mesh position={[0, 0.32, -0.02]} castShadow>
          <boxGeometry args={[0.42, 0.64, 0.43]} />
          <meshStandardMaterial color="#8da6b7" metalness={0.58} roughness={0.36} />
        </mesh>
        <mesh position={[0, 0.35, 0.207]}>
          <boxGeometry args={[0.31, 0.45, 0.012]} />
          <meshStandardMaterial color={status === "running" ? "#1e3444" : "#611e30"} emissive={status === "running" ? "#0a2733" : "#a9192c"} emissiveIntensity={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.68, 0.205]}>
          <boxGeometry args={[0.31, 0.045, 0.018]} />
          <meshStandardMaterial color={STATUS_COLORS[status]} emissive={STATUS_COLORS[status]} emissiveIntensity={0.55} />
        </mesh>
      </group>
    </group>
  );
}
