import type { DeviceStatus, Position3 } from "./types";
import { STATUS_COLORS } from "./types";

interface Props {
  position: Position3;
  status: DeviceStatus;
  fuelPercent: number;
  onSelect?: () => void;
}

/** Compact generator with a visible fuel level indicator on the front. */
export default function DieselGenerator({ position, status, fuelPercent, onSelect }: Props) {
  const fuel = Math.min(100, Math.max(0, fuelPercent));
  const indicatorColor = status === "running" ? STATUS_COLORS.running : STATUS_COLORS[status];

  return (
    <group position={position} onClick={(event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect?.(); }} userData={{ system: "dg" }}>
      {/* Concrete pad */}
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[1.13, 0.05, 0.82]} />
        <meshStandardMaterial color="#9da9b5" />
      </mesh>
      {/* Canopy enclosure */}
      <mesh position={[0, 0.39, 0]} castShadow>
        <boxGeometry args={[0.99, 0.66, 0.67]} />
        <meshStandardMaterial color={status === "running" ? "#1e5144" : status === "fault" ? "#7c2736" : "#283b4c"} emissive={status === "running" ? "#063d27" : status === "fault" ? "#5a0c22" : "#000000"} emissiveIntensity={0.28} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.67, 0]} castShadow>
        <boxGeometry args={[1.05, 0.06, 0.73]} />
        <meshStandardMaterial color="#142737" metalness={0.55} />
      </mesh>
      {/* Front service grille */}
      {[-0.21, -0.15, -0.09, -0.03, 0.03, 0.09, 0.15, 0.21].map((x) => (
        <mesh key={x} position={[x, 0.4, 0.344]}>
          <boxGeometry args={[0.018, 0.37, 0.008]} />
          <meshStandardMaterial color="#71899b" metalness={0.7} />
        </mesh>
      ))}
      {/* Diesel gauge: fill line shrinks when fuelPercent changes */}
      <mesh position={[0.36, 0.44, 0.347]}>
        <boxGeometry args={[0.09, 0.42, 0.016]} />
        <meshStandardMaterial color="#07131d" />
      </mesh>
      {fuel > 0 && (
        <mesh position={[0.36, 0.245 + (0.38 * fuel / 100) / 2, 0.362]}>
          <boxGeometry args={[0.057, 0.38 * fuel / 100, 0.012]} />
          <meshStandardMaterial color={fuel <= 20 ? "#fa5d51" : "#f8c95d"} emissive={fuel <= 20 ? "#7a100c" : "#725011"} emissiveIntensity={0.25} />
        </mesh>
      )}
      {/* Exhaust */}
      <mesh position={[-0.3, 0.85, -0.14]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.36, 12]} />
        <meshStandardMaterial color="#24313b" metalness={0.7} />
      </mesh>
      {/* Visible operational indicator */}
      <mesh position={[-0.34, 0.53, 0.346]}>
        <sphereGeometry args={[0.057, 12, 12]} />
        <meshStandardMaterial color={indicatorColor} emissive={indicatorColor} emissiveIntensity={0.65} />
      </mesh>
    </group>
  );
}
