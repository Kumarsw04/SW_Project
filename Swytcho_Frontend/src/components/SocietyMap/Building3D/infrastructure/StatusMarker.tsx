import { Html } from "@react-three/drei";
import type { DeviceStatus, Position3 } from "./types";
import { STATUS_COLORS } from "./types";

interface Props {
  position: Position3;
  status: DeviceStatus;
  label: string;
  selected?: boolean;
}

/** A 3D-anchored status beacon and compact label. Neither blocks scene clicks. */
export default function StatusMarker({ position, status, label, selected = false }: Props) {
  const color = STATUS_COLORS[status];
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[selected ? 0.105 : 0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.18, 32]} />
          <meshBasicMaterial color="#f8fbff" side={2} transparent opacity={0.95} />
        </mesh>
      )}
      <Html center position={[0, 0.23, 0]} distanceFactor={7} style={{ pointerEvents: "none" }}>
        <span className={`swytcho-model-tag swytcho-model-tag--${status}${selected ? " swytcho-model-tag--selected" : ""}`}>
          {label} · {status === "running" ? "ON" : status === "fault" ? "FAULT" : "OFF"}
        </span>
      </Html>
    </group>
  );
}
