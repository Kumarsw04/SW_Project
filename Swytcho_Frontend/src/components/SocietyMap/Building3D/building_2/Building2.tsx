
import { useMemo } from "react";
import * as THREE from "three";

export default function Building2() {
  const materials = useMemo(
    () => ({
      facade: new THREE.MeshStandardMaterial({
        color: "#b9c5d1",
        roughness: 0.85,
        side: THREE.DoubleSide,
      }),
      structure: new THREE.MeshStandardMaterial({
        color: "#8999aa",
        roughness: 0.7,
      }),
      roof: new THREE.MeshStandardMaterial({
        color: "#d1d8df",
        roughness: 0.8,
      }),
      detail: new THREE.MeshStandardMaterial({
        color: "#a5b3c1",
        roughness: 0.75,
      }),
    }),
    []
  );

  return (
    <group>
      {/* Foundation */}
      <mesh position={[0, -0.08, 0]} material={materials.roof}>
        <boxGeometry args={[10.2, 0.16, 7.2]} />
      </mesh>

      {/* Main front facade */}
      <mesh
        position={[0, 1.65, 3.45]}
        material={materials.facade}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[10, 3.3, 0.12]} />
      </mesh>

      {/* Right side structure */}
      <mesh
        position={[4.95, 1.65, -0.05]}
        material={materials.facade}
        castShadow
      >
        <boxGeometry args={[0.12, 3.3, 7]} />
      </mesh>

      {/* Rear structure */}
      <mesh
        position={[0, 1.65, -3.45]}
        material={materials.facade}
      >
        <boxGeometry args={[10, 3.3, 0.12]} />
      </mesh>

      {/* Left side frame */}
      <mesh
        position={[-4.95, 1.65, -0.05]}
        material={materials.structure}
      >
        <boxGeometry args={[0.12, 3.3, 7]} />
      </mesh>

      {/* Top roof slab */}
      <mesh
        position={[0, 3.35, 0]}
        material={materials.roof}
        castShadow
      >
        <boxGeometry args={[10.15, 0.18, 7.15]} />
      </mesh>

      {/* Raised central rooftop structure */}
      <mesh
        position={[0.3, 3.65, -1.3]}
        material={materials.facade}
        castShadow
      >
        <boxGeometry args={[3.5, 0.55, 2.2]} />
      </mesh>

      {/* Raised rooftop side panels */}
      {[-3.8, 3.8].map((x) => (
        <mesh
          key={`roof-panel-${x}`}
          position={[x, 3.55, -1.2]}
          material={materials.detail}
        >
          <boxGeometry args={[0.16, 0.4, 3.5]} />
        </mesh>
      ))}

      {/* Top structural beams */}
      {[-2.5, -1.25, 0, 1.25, 2.5].map((z) => (
        <mesh
          key={`top-beam-${z}`}
          position={[0, 3.48, z]}
          material={materials.structure}
        >
          <boxGeometry args={[9.8, 0.08, 0.09]} />
        </mesh>
      ))}

      {/* Front vertical supports */}
      {[-4.8, -2.4, 0, 2.4, 4.8].map((x) => (
        <mesh
          key={`front-support-${x}`}
          position={[x, 1.65, 3.36]}
          material={materials.structure}
        >
          <boxGeometry args={[0.08, 3.3, 0.08]} />
        </mesh>
      ))}

      {/* Side vertical divisions */}
      {[-2.5, -0.8, 0.8, 2.5].map((z) => (
        <mesh
          key={`side-support-${z}`}
          position={[4.86, 1.65, z]}
          material={materials.structure}
        >
          <boxGeometry args={[0.08, 3.3, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}
