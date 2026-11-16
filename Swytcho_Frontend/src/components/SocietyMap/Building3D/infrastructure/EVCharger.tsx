import * as THREE from "three";
import { useMemo } from "react";
import type { DeviceStatus, Position3 } from "./types";
import { STATUS_COLORS } from "./types";

interface Props {
  position: Position3;
  status: DeviceStatus;
  onSelect?: () => void;
}

export default function EVCharger({ position, status, onSelect }: Props) {
  const cable = useMemo(() =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.11, 0.56, 0.1),
      new THREE.Vector3(0.35, 0.52, 0.1),
      new THREE.Vector3(0.4, 0.15, 0.12),
      new THREE.Vector3(0.56, 0.12, 0.12),
    ]), []);

  return (
    <group position={position} onClick={(event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect?.(); }} userData={{ system: "ev-charger" }}>
      {/* Parking bay */}
      <mesh position={[0.2, 0.014, -0.35]} receiveShadow>
        <boxGeometry args={[1.35, 0.025, 1.15]} />
        <meshStandardMaterial color="#3c4c59" roughness={0.95} />
      </mesh>
      {[-0.92, 0.22].map((z) => (
        <mesh key={z} position={[0.2, 0.03, z]}>
          <boxGeometry args={[1.1, 0.009, 0.025]} />
          <meshStandardMaterial color="#e7de8b" />
        </mesh>
      ))}
      {/* Charger pillar */}
      <mesh position={[0, 0.52, 0.13]} castShadow>
        <boxGeometry args={[0.33, 1.0, 0.3]} />
        <meshStandardMaterial color="#e0e9ee" metalness={0.25} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.67, 0.287]}>
        <boxGeometry args={[0.24, 0.29, 0.02]} />
        <meshStandardMaterial color={status === "running" ? "#14283c" : "#48242f"} emissive={STATUS_COLORS[status]} emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, 0.85, 0.302]}>
        <boxGeometry args={[0.18, 0.055, 0.01]} />
        <meshStandardMaterial color={STATUS_COLORS[status]} emissive={STATUS_COLORS[status]} emissiveIntensity={0.8} />
      </mesh>
      <mesh>
        <tubeGeometry args={[cable, 16, 0.029, 7, false]} />
        <meshStandardMaterial color="#18252e" />
      </mesh>
      <mesh position={[0.56, 0.13, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.14, 0.055, 0.065]} />
        <meshStandardMaterial color="#1f313b" />
      </mesh>
    </group>
  );
}
