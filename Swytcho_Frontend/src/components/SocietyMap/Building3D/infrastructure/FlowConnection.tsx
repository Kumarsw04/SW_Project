import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DeviceStatus, Position3 } from "./types";

interface Props {
  points: Position3[];
  status: DeviceStatus;
  water?: boolean;
  /** kW is used only to set animation speed; no electrical computation occurs in 3D. */
  flowKw?: number;
  /** Forward = first point to last point. */
  direction?: "forward" | "reverse";
  /** Different colors distinguish the incoming power sources. */
  source?: "grid" | "dg" | "solar" | "load";
  phase?: number;
}

const SOURCE_COLOR: Record<NonNullable<Props["source"]>, string> = {
  grid: "#43dcba",
  dg: "#ffbc54",
  solar: "#4fe2ff",
  load: "#48f39f",
};

/**
 * Animated flow visualization. The three tracers move along the cable only
 * while its circuit is energized; red/grey indicates a stopped circuit.
 * This is an illustrative effect, not a current sensor.
 */
export default function FlowConnection({
  points, status, water = false, flowKw = 0, direction = "forward", source = "load", phase = 0,
}: Props) {
  const tracers = useRef<THREE.Group>(null);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))),
    [points],
  );
  const on = status === "running";
  const color = on ? (water ? "#46d8fb" : SOURCE_COLOR[source]) : status === "fault" ? "#ff254a" : "#c05463";
  const speed = water ? 0.19 : 0.17 + Math.min(Math.max(flowKw, 0), 24) * 0.009;

  useFrame(({ clock }) => {
    if (!tracers.current || !on) return;
    const elapsed = clock.getElapsedTime();
    for (let i = 0; i < tracers.current.children.length; i += 1) {
      const offset = (elapsed * speed + phase + i / 3) % 1;
      const fraction = direction === "reverse" ? 1 - offset : offset;
      tracers.current.children[i].position.copy(curve.getPointAt(fraction));
    }
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 36, water ? 0.019 : 0.016, 8, false]} />
        <meshStandardMaterial
          color={color} emissive={color}
          emissiveIntensity={on ? 0.85 : status === "fault" ? 0.65 : 0.18}
          transparent opacity={status === "fault" ? 1 : 0.92}
        />
      </mesh>
      <group ref={tracers} visible={on}>
        {[0, 1, 2].map((index) => (
          <mesh key={index}>
            <sphereGeometry args={[water ? 0.044 : 0.038, 10, 10]} />
            <meshBasicMaterial color={water ? "#ddf8ff" : source === "dg" ? "#ffe2a0" : "#defff2"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
