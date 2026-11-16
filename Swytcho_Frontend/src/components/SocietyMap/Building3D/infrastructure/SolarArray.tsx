import type { DeviceStatus, Position3 } from "./types";
import { STATUS_COLORS } from "./types";

interface Props {
  position: Position3;
  status: DeviceStatus;
  onSelect?: () => void;
}

export default function SolarArray({ position, status, onSelect }: Props) {
  return (
    <group position={position} onClick={(event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect?.(); }} userData={{ system: "solar" }}>
      {[0, 1].flatMap((row) =>
        [0, 1, 2].map((column) => {
          const x = (column - 1) * 0.72;
          const z = (row - 0.5) * 0.66;
          return (
            <group key={`${row}-${column}`} position={[x, 0.13, z]} rotation={[-0.2, 0, 0]}>
              <mesh position={[0, -0.12, 0]}>
                <boxGeometry args={[0.04, 0.24, 0.05]} />
                <meshStandardMaterial color="#5a707d" metalness={0.65} />
              </mesh>
              <mesh castShadow>
                <boxGeometry args={[0.66, 0.055, 0.57]} />
                <meshStandardMaterial color={status === "running" ? "#183c64" : "#3b3f50"} metalness={0.48} roughness={0.26} emissive={status === "running" ? "#062042" : "#000000"} />
              </mesh>
              {[-0.17, 0.17].map((line) => (
                <mesh key={line} position={[line, 0.032, 0]}>
                  <boxGeometry args={[0.012, 0.005, 0.55]} />
                  <meshStandardMaterial color="#93bbd1" metalness={0.7} />
                </mesh>
              ))}
              <mesh position={[0, 0.034, 0]}>
                <boxGeometry args={[0.64, 0.005, 0.012]} />
                <meshStandardMaterial color="#93bbd1" metalness={0.7} />
              </mesh>
            </group>
          );
        })
      )}
      <mesh position={[1.3, 0.11, 0.35]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color={STATUS_COLORS[status]} emissive={STATUS_COLORS[status]} emissiveIntensity={0.75} />
      </mesh>
    </group>
  );
}
