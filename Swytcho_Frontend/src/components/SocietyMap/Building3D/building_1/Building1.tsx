import { useMemo } from "react";
import * as THREE from "three";
import DieselGenerator from "../infrastructure/DieselGenerator";
import Lift from "../infrastructure/Lift";
import WaterPump from "../infrastructure/WaterPump";
import SolarArray from "../infrastructure/SolarArray";
import EVCharger from "../infrastructure/EVCharger";
import FlowConnection from "../infrastructure/FlowConnection";
import DistributionBoard from "../infrastructure/DistributionBoard";
import StatusMarker from "../infrastructure/StatusMarker";
import { deriveBuilding, type PowerMode } from "../simulation/deriveBuilding";
import {
  DEFAULT_BUILDING_STATE,
  type BuildingSystemsState,
  type DeviceStatus,
  type SystemId,
} from "../infrastructure/types";

export interface Building1Props {
  /** External simulator state. Omit to display the baseline operating view. */
  state?: BuildingSystemsState;
  showConnections?: boolean;
  onSelectSystem?: (id: SystemId) => void;
  selectedSystem?: SystemId | null;
}

const FLOOR_HEIGHT = 0.95;
const FLOOR_COUNT = 4;

/**
 * Visual-only lighting for one open-front floor. The existing simulator
 * determines the power mode; this component never changes its state.
 *
 * Grid: both light banks are bright cool white.
 * DG: one bank stays lit in warm amber (emergency/essential lighting).
 * Blackout: both banks go dark, including the floor light spill.
 */
function FloorLighting({ floor, mode }: { floor: number; mode: PowerMode }) {
  const grid = mode === "grid";
  const backup = mode === "dg";
  const powered = grid || backup;
  const activeColor = grid ? "#d6fbff" : "#ffd08a";
  const floorAccent = grid ? "#4de4fd" : backup ? "#f5ae50" : "#35424c";

  return (
    <group position={[0, floor * FLOOR_HEIGHT, 0]} name={`Floor-${floor + 1}-lighting`}>
      {/* Two readable ceiling fixtures and matching glowing rear room panels. */}
      {[-0.25, 1.26].map((x, index) => {
        const lit = grid || (backup && index === 0);
        const bulb = lit ? activeColor : "#26333f";
        return (
          <group key={`room-light-${index}`}>
            {/* Dark recessed fixture frame. */}
            <mesh position={[x, 0.815, 0.30]}>
              <boxGeometry args={[1.10, 0.065, 0.42]} />
              <meshStandardMaterial color="#3b5365" metalness={0.45} roughness={0.36} />
            </mesh>
            {/* Broad luminous diffuser visible even from a distant camera. */}
            <mesh position={[x, 0.773, 0.30]}>
              <boxGeometry args={[0.94, 0.025, 0.32]} />
              <meshBasicMaterial color={bulb} toneMapped={false} />
            </mesh>
            {/* A strong luminous window/back-wall panel per room. */}
            <mesh position={[x, 0.43, -0.891]}>
              <boxGeometry args={[1.02, 0.61, 0.042]} />
              <meshStandardMaterial color="#40576a" metalness={0.22} roughness={0.55} />
            </mesh>
            <mesh position={[x, 0.43, -0.865]}>
              <boxGeometry args={[0.88, 0.49, 0.021]} />
              <meshStandardMaterial
                color={lit ? (grid ? "#a8dfee" : "#d59b50") : "#1e2b37"}
                emissive={lit ? activeColor : "#000000"}
                emissiveIntensity={lit ? (grid ? 1.6 : 1.0) : 0}
                roughness={0.28}
              />
            </mesh>
            {/* Functional light spill: off during blackout, dim on DG. */}
            <pointLight
              position={[x, 0.68, 0.32]}
              color={activeColor}
              intensity={lit ? (grid ? 0.9 : 0.45) : 0}
              distance={2.25}
              decay={2}
            />
          </group>
        );
      })}

      {/* Strong front-facing floor light strip; visible at the default zoom. */}
      <mesh position={[0.64, 0.88, 1.059]}>
        <boxGeometry args={[2.58, 0.085, 0.075]} />
        <meshBasicMaterial color={floorAccent} toneMapped={false} />
      </mesh>
      {/* Four larger status indicators make each floor easy to distinguish. */}
      <mesh position={[1.953, 0.48, 1.065]}>
        <boxGeometry args={[0.135, 0.50, 0.07]} />
        <meshBasicMaterial color={floorAccent} toneMapped={false} />
      </mesh>
      {/* Vertical strokes count floors 1 through 4 without loading a font. */}
      {Array.from({ length: floor + 1 }, (_, i) => (
        <mesh key={`floor-tick-${i}`} position={[1.78, 0.22 + i * 0.11, 1.08]}>
          <boxGeometry args={[0.12, 0.035, 0.025]} />
          <meshBasicMaterial color={powered ? "#f4fbff" : "#6a7783"} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Open-front 3D building with high-contrast, per-floor interior lighting.
 * All existing equipment, coordinates, flows and simulations are preserved.
 * Do not place a <Canvas> here: BuildingViewer already owns the R3F canvas.
 *
 * Coordinate convention: x = left/right, y = height, z = depth (front is +z).
 * A stateful simulator and alerts panel can be added above this presentational model.
 */
export default function Building1({
  state = DEFAULT_BUILDING_STATE,
  showConnections = true,
  onSelectSystem,
  selectedSystem = null,
}: Building1Props) {
  const materials = useMemo(() => ({
    concrete: new THREE.MeshStandardMaterial({ color: "#a7b8c6", roughness: 0.8 }),
    slab: new THREE.MeshStandardMaterial({ color: "#c2d0da", roughness: 0.78 }),
    steel: new THREE.MeshStandardMaterial({ color: "#526b7e", metalness: 0.4, roughness: 0.42 }),
    roof: new THREE.MeshStandardMaterial({ color: "#92a7b5", roughness: 0.72 }),
    ground: new THREE.MeshStandardMaterial({ color: "#84949d", roughness: 0.95 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#9ad4ee", transparent: true, opacity: 0.18, roughness: 0.1, metalness: 0.1, depthWrite: false }),
    window: new THREE.MeshPhysicalMaterial({ color: "#6ca9cc", transparent: true, opacity: 0.62, roughness: 0.12, metalness: 0.12, depthWrite: false }),
    pool: new THREE.MeshStandardMaterial({ color: "#25aada", metalness: 0.05, roughness: 0.19, transparent: true, opacity: 0.84 }),
  }), []);

  const snapshot = deriveBuilding(state);
  const { powerMode, effective } = snapshot;
  const hasBuildingPower = powerMode !== "none";
  const evStatus: DeviceStatus = effective.evCharger;
  const { circuits } = snapshot;
  const mainStatus: DeviceStatus = hasBuildingPower ? "running" : "off";
  const operationalGlow = powerMode === "grid" ? "#9eeaff" : powerMode === "dg" ? "#f9bd67" : "#151d27";

  return (
    <group name="SWYTCHO-Building-1">
      {/* Site plinth. Existing viewer may need a wider camera framing to show the site. */}
      <mesh position={[0, -0.16, 0.15]} receiveShadow>
        <boxGeometry args={[8.3, 0.26, 4.45]} />
        <primitive object={materials.ground} attach="material" />
      </mesh>

      {/* Utility grid cabinet and the main distribution board (MDB). */}
      <group position={[-3.9, 0, -0.22]} name="Simulated-grid-input">
        <mesh position={[0, 0.29, 0]} castShadow>
          <boxGeometry args={[0.28, 0.56, 0.28]} />
          <meshStandardMaterial color="#34495b" metalness={0.45} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.4, 0.148]}>
          <boxGeometry args={[0.17, 0.075, 0.014]} />
          <meshBasicMaterial color={state.gridAvailable ? "#41dfb1" : "#f05757"} />
        </mesh>
      </group>
      <DistributionBoard position={[-2.1, 0, -0.2]} mode={powerMode} loadKw={snapshot.activeLoadKw} ratingKw={snapshot.maximumBackupKw} />
      <StatusMarker position={[-3.9, 0.88, -0.22]} label="GRID" status={circuits.grid.status} />
      <StatusMarker position={[-2.1, 1.14, -0.2]} label={powerMode === "dg" ? "MDB / DG" : "MDB"} status={mainStatus} />

      {/* Recessed building base */}
      <mesh position={[0, -0.005, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.15, 0.18, 2.12]} />
        <primitive object={materials.slab} attach="material" />
      </mesh>

      {/* Building-wide power sign and floor lamps respond to grid / DG / blackout. */}
      <StatusMarker
        position={[0.2, 4.51, 0.93]}
        label={powerMode === "dg" ? "DG BACKUP" : powerMode === "grid" ? "GRID POWER" : "NO POWER"}
        status={hasBuildingPower ? "running" : "off"}
      />
      {Array.from({ length: FLOOR_COUNT }, (_, floor) => (
        <FloorLighting key={`floor-light-${floor}`} floor={floor} mode={powerMode} />
      ))}

      {/* Four floor plates and a roof. Front is deliberately open for interior view. */}
      {Array.from({ length: FLOOR_COUNT + 1 }, (_, i) => (
        <mesh key={`slab-${i}`} position={[0, i * FLOOR_HEIGHT, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.13, 0.09, 2.03]} />
          <primitive object={i === FLOOR_COUNT ? materials.roof : materials.slab} attach="material" />
        </mesh>
      ))}
      {/* Deep horizontal facade bands distinguish all four floors at a glance. */}
      {Array.from({ length: FLOOR_COUNT + 1 }, (_, level) => (
        <mesh key={`front-floor-band-${level}`} position={[0, level * FLOOR_HEIGHT + 0.016, 1.028]} castShadow>
          <boxGeometry args={[4.16, 0.075, 0.08]} />
          <primitive object={materials.steel} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 1.88, -0.975]} castShadow>
        <boxGeometry args={[4.04, 3.7, 0.075]} />
        <primitive object={materials.concrete} attach="material" />
      </mesh>
      {[-2, 2].map((x) => (
        <mesh key={`side-${x}`} position={[x, 1.9, 0]}>
          <boxGeometry args={[0.07, 3.8, 1.95]} />
          <primitive object={materials.glass} attach="material" />
        </mesh>
      ))}
      {[-1.96, -0.66, 0.67, 1.96].map((x) => (
        <mesh key={`column-${x}`} position={[x, 1.9, 0.95]} castShadow>
          <boxGeometry args={[0.08, 3.85, 0.1]} />
          <primitive object={materials.steel} attach="material" />
        </mesh>
      ))}

      {/* Four exposed floors, with rooms on the right and a twin lift core on the left. */}
      {Array.from({ length: FLOOR_COUNT }, (_, floor) => (
        <group key={`floor-${floor}`} position={[0, floor * FLOOR_HEIGHT, 0]}>
          <mesh position={[0.7, 0.47, -0.07]}>
            <boxGeometry args={[0.05, 0.84, 1.77]} />
            <primitive object={materials.concrete} attach="material" />
          </mesh>
          <mesh position={[1.3, 0.52, -0.925]}>
            <boxGeometry args={[0.78, 0.54, 0.014]} />
            <meshStandardMaterial
              color={hasBuildingPower ? "#6ca9cc" : "#34434d"}
              emissive={operationalGlow}
              emissiveIntensity={hasBuildingPower ? (powerMode === "grid" ? 0.25 : 0.08) : 0}
              transparent opacity={0.84} roughness={0.18}
            />
          </mesh>
          {/* Balcony handrail provides a clear separation between floors. */}
          <mesh position={[0.62, 0.23, 1.002]}>
            <boxGeometry args={[2.61, 0.42, 0.018]} />
            <primitive object={materials.glass} attach="material" />
          </mesh>
          <mesh position={[0.62, 0.46, 1.008]}>
            <boxGeometry args={[2.63, 0.025, 0.04]} />
            <primitive object={materials.steel} attach="material" />
          </mesh>
        </group>
      ))}
      {/* Roof parapet */}
      {[-0.95, 0.95].map((z) => (
        <mesh key={`parapet-${z}`} position={[0, 3.96, z]}>
          <boxGeometry args={[4.1, 0.19, 0.07]} />
          <primitive object={materials.concrete} attach="material" />
        </mesh>
      ))}

      {/* Solar PV array; rooftop water tank belongs to the tank pump. */}
      <SolarArray position={[-0.58, 3.94, 0]} status={effective.solar} onSelect={() => onSelectSystem?.("solar")} />
      <group position={[1.55, 3.84, -0.32]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.72, 24]} />
          <meshStandardMaterial color="#879ca9" metalness={0.35} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.81, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 0.06, 24]} />
          <meshStandardMaterial color="#4f7183" metalness={0.45} />
        </mesh>
        <mesh position={[0, 0.54, 0.306]}>
          <boxGeometry args={[0.28, 0.18, 0.016]} />
          <meshStandardMaterial color="#24b7e4" emissive="#07536d" emissiveIntensity={0.35} />
        </mesh>
      </group>

      {/* Exactly two lifts with individual operational statuses. */}
      <Lift id="lift-1" position={[-1.64, 0.02, 0.27]} currentFloor={0} status={effective.lifts[0]} onSelect={() => onSelectSystem?.("lift-1")} />
      <Lift id="lift-2" position={[-1.03, 0.02, 0.27]} currentFloor={2} status={effective.lifts[1]} onSelect={() => onSelectSystem?.("lift-2")} />

      {/* Outdoor service equipment. Each model is reusable in other buildings. */}
      <DieselGenerator position={[-2.9, 0, 0.36]} status={state.dg.status} fuelPercent={state.dg.fuelPercent} onSelect={() => onSelectSystem?.("dg")} />
      <WaterPump id="tank-pump" position={[2.46, 0.02, 0.65]} status={effective.pumps.tank} onSelect={() => onSelectSystem?.("tank-pump")} />
      <WaterPump id="pool-pump" position={[3.37, 0.02, 0.65]} status={effective.pumps.pool} onSelect={() => onSelectSystem?.("pool-pump")} />
      <EVCharger position={[0.08, 0.02, 1.8]} status={evStatus} onSelect={() => onSelectSystem?.("ev-charger")} />

      {/* Large, always-visible 3D status tags attached to the actual equipment. */}
      <StatusMarker position={[-2.9, 1.17, 0.36]} label="DG" status={state.dg.status} selected={selectedSystem === "dg"} />
      <StatusMarker position={[-1.64, 3.93, 0.27]} label="LIFT 1" status={effective.lifts[0]} selected={selectedSystem === "lift-1"} />
      <StatusMarker position={[-1.03, 3.93, 0.27]} label="LIFT 2" status={effective.lifts[1]} selected={selectedSystem === "lift-2"} />
      <StatusMarker position={[2.46, 0.89, 0.65]} label="TANK PUMP" status={effective.pumps.tank} selected={selectedSystem === "tank-pump"} />
      <StatusMarker position={[3.37, 0.89, 0.65]} label="POOL PUMP" status={effective.pumps.pool} selected={selectedSystem === "pool-pump"} />
      <StatusMarker position={[-0.58, 4.29, 0]} label="SOLAR" status={effective.solar} selected={selectedSystem === "solar"} />
      <StatusMarker position={[0.08, 1.26, 1.8]} label="EV" status={evStatus} selected={selectedSystem === "ev-charger"} />

      {/* Pool at far right; pool pump cable/pipe turns red if faulted or off. */}
      <mesh position={[3.16, -0.015, -0.76]} receiveShadow>
        <boxGeometry args={[1.65, 0.11, 1.12]} />
        <primitive object={materials.concrete} attach="material" />
      </mesh>
      <mesh position={[3.16, 0.045, -0.76]}>
        <boxGeometry args={[1.48, 0.025, 0.96]} />
        <primitive object={materials.pool} attach="material" />
      </mesh>

      {showConnections && (
        <group name="Power-distribution-and-water-flow">
          {/* Sources all feed the MDB. Three moving tracers show power direction. */}
          <FlowConnection
            points={[[-3.9, 0.12, -0.2], [-3.55, 0.12, -0.2], [-2.1, 0.12, -0.2]]}
            status={circuits.grid.status} flowKw={circuits.grid.kw} source="grid"
          />
          <FlowConnection
            points={[[-2.6, 0.3, 0.37], [-2.35, 0.22, 0.3], [-2.1, 0.12, -0.2]]}
            status={circuits.dg.status} flowKw={circuits.dg.kw} source="dg" phase={0.4}
          />
          <FlowConnection
            points={[[-0.55, 4.06, 0.25], [-1.98, 4.06, 0.25], [-2.1, 0.12, -0.2]]}
            status={circuits.solar.status} flowKw={circuits.solar.kw} source="solar" phase={0.2}
          />
          {/* Essential building lighting and both lift circuits. */}
          <FlowConnection
            points={[[-2.1, 0.12, -0.2], [-1.77, 0.16, 0.55], [-1.77, 3.64, 0.55]]}
            status={circuits.building.status} flowKw={circuits.building.kw} phase={0.15}
          />
          <FlowConnection
            points={[[-2.1, 0.12, -0.2], [-1.64, 0.17, 0.27], [-1.64, 2.8, 0.27]]}
            status={circuits["lift-1"].status} flowKw={circuits["lift-1"].kw} phase={0.3}
          />
          <FlowConnection
            points={[[-2.1, 0.12, -0.2], [-1.03, 0.17, 0.27], [-1.03, 2.8, 0.27]]}
            status={circuits["lift-2"].status} flowKw={circuits["lift-2"].kw} phase={0.6}
          />
          {/* Separate electrical power connections to the two pumps. */}
          <FlowConnection
            points={[[-2.1, 0.12, -0.2], [2.5, 0.12, -0.2], [2.46, 0.39, 0.65]]}
            status={circuits["tank-pump"].status} flowKw={circuits["tank-pump"].kw} phase={0.4}
          />
          <FlowConnection
            points={[[-2.1, 0.12, -0.2], [3.35, 0.12, -0.2], [3.37, 0.39, 0.65]]}
            status={circuits["pool-pump"].status} flowKw={circuits["pool-pump"].kw} phase={0.1}
          />
          {/* Blue lines show water, independent of electrical paths. */}
          <FlowConnection
            points={[[2.46, 0.51, 0.65], [2.25, 1.0, 0.65], [2.25, 4.4, -0.32], [1.86, 4.4, -0.32]]}
            status={effective.pumps.tank} water phase={0.1}
          />
          <FlowConnection
            points={[[3.37, 0.52, 0.65], [3.62, 0.38, 0.18], [3.62, 0.06, -0.6]]}
            status={effective.pumps.pool} water phase={0.7}
          />
          {/* EV circuit is shed under DG backup, turning its conductor red. */}
          <FlowConnection
            points={[[-2.1, 0.12, -0.2], [-1.9, 0.12, 1.41], [0.08, 0.12, 1.41], [0.08, 0.45, 1.8]]}
            status={circuits["ev-charger"].status} flowKw={circuits["ev-charger"].kw} phase={0.5}
          />
        </group>
      )}
    </group>
  );
}
