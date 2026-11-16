import type { Position3, DeviceStatus } from "./types";
import type { PowerMode } from "../simulation/deriveBuilding";

interface Props {
  position: Position3;
  mode: PowerMode;
  loadKw: number;
  ratingKw: number;
}

/** A visible main distribution board at the electrical bus junction. */
export default function DistributionBoard({ position, mode, loadKw, ratingKw }: Props) {
  const status: DeviceStatus = mode === "none" ? "off" : "running";
  const active = status === "running";
  const led = mode === "dg" ? "#ffbc54" : active ? "#36e0a9" : "#ed455b";
  const utilization = mode === "dg" ? Math.min(1, loadKw / ratingKw) : active ? 0.65 : 0;
  return (
    <group position={position} name="Main-Distribution-Board">
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.47, 0.73, 0.25]} />
        <meshStandardMaterial color="#1a3345" metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.35, 0.131]}>
        <boxGeometry args={[0.41, 0.65, 0.008]} />
        <meshStandardMaterial color="#2a475b" metalness={0.3} />
      </mesh>
      {[0, 1, 2].map((n) => (
        <mesh key={n} position={[-0.12 + n * 0.12, 0.56, 0.14]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={active ? led : "#ed455b"} />
        </mesh>
      ))}
      <mesh position={[0, 0.37, 0.14]}>
        <boxGeometry args={[0.30, 0.12, 0.018]} />
        <meshBasicMaterial color="#081522" />
      </mesh>
      {utilization > 0 && (
        <mesh position={[-0.14 + utilization * 0.14, 0.37, 0.155]}>
          <boxGeometry args={[utilization * 0.28, 0.066, 0.008]} />
          <meshBasicMaterial color={led} />
        </mesh>
      )}
      <mesh position={[0, 0.09, 0.15]}>
        <boxGeometry args={[0.28, 0.055, 0.012]} />
        <meshBasicMaterial color={led} />
      </mesh>
    </group>
  );
}
