import type { DeviceStatus, Position3, SystemId } from "./types";
import { STATUS_COLORS } from "./types";

interface Props {
  position: Position3;
  status: DeviceStatus;
  id: Extract<SystemId, "tank-pump" | "pool-pump">;
  onSelect?: () => void;
}

export default function WaterPump({ position, status, id, onSelect }: Props) {
  return (
    <group position={position} onClick={(event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect?.(); }} userData={{ system: id }}>
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.07, 0.59]} />
        <meshStandardMaterial color="#a0abb6" />
      </mesh>
      {/* Electric motor */}
      <mesh position={[-0.1, 0.23, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.43, 16]} />
        <meshStandardMaterial color={status === "running" ? "#2d5265" : "#7a303a"} emissive={status === "running" ? "#086546" : "#b51d36"} emissiveIntensity={0.28} metalness={0.45} roughness={0.42} />
      </mesh>
      {/* Impeller housing */}
      <mesh position={[0.23, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.21, 0.17, 18]} />
        <meshStandardMaterial color="#708b9d" metalness={0.55} />
      </mesh>
      {/* Discharge pipe */}
      <mesh position={[0.23, 0.5, 0]}>
        <cylinderGeometry args={[0.053, 0.053, 0.4, 10]} />
        <meshStandardMaterial color="#7ea3b7" metalness={0.45} />
      </mesh>
      {/* Colored equipment indicator */}
      <mesh position={[-0.23, 0.38, 0.17]}>
        <sphereGeometry args={[0.058, 12, 12]} />
        <meshStandardMaterial color={STATUS_COLORS[status]} emissive={STATUS_COLORS[status]} emissiveIntensity={0.65} />
      </mesh>
    </group>
  );
}
