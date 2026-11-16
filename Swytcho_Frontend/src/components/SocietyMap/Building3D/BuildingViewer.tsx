import { Canvas } from "@react-three/fiber";
import { Bounds, ContactShadows, Environment, OrbitControls } from "@react-three/drei";

import Building1 from "./building_1/Building1";
import Building2 from "./building_2/Building2";
import SimulationPanel from "./simulation/SimulationPanel";
import { useBuildingSimulationContext } from "./simulation/BuildingSimulationContext";
import "./BuildingViewer.css";

export interface AssignedBuilding {
  building_code: string;
  building_name: string;
}
interface BuildingViewerProps {
  assignedBuildings: AssignedBuilding[];
}

const SPACING = 13;

export default function BuildingViewer({ assignedBuildings }: BuildingViewerProps) {
  const simulation = useBuildingSimulationContext();
  const hasBuilding1 = assignedBuildings.some((b) => b.building_code === "building_1");

  if (assignedBuildings.length === 0) {
    return <div className="building-viewer building-viewer--empty">No buildings assigned to this account.</div>;
  }

  return (
    <div className={`building-viewer${hasBuilding1 ? " building-viewer--simulation" : ""}`}>
      <div className="building-viewer__stage">
        <Canvas shadows camera={{ position: [10, 8, 15], fov: 45, near: 0.1, far: 250 }}>
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={1.15} />
          <directionalLight position={[8, 12, 8]} intensity={1.9} castShadow shadow-mapSize={[2048, 2048]} />
          <Environment preset="city" />

          <Bounds key={assignedBuildings.map((b) => b.building_code).join("|")} fit clip observe margin={1.2}>
            <group name="Assigned-buildings">
              {assignedBuildings.map((building, index) => {
                const x = index * SPACING - ((assignedBuildings.length - 1) * SPACING) / 2;
                return (
                  <group key={building.building_code} name={building.building_name} position={[x, 0, 0]}>
                    {building.building_code === "building_1" && (
                      <Building1
                        state={simulation.systems}
                        showConnections={simulation.showConnections}
                        selectedSystem={simulation.selectedSystem}
                        onSelectSystem={simulation.setSelectedSystem}
                      />
                    )}
                    {building.building_code === "building_2" && <Building2 />}
                  </group>
                );
              })}
            </group>
          </Bounds>

          <ContactShadows position={[0, -0.3, 0]} opacity={0.3} scale={Math.max(35, assignedBuildings.length * SPACING)} blur={2} far={15} />
          <OrbitControls makeDefault enableDamping dampingFactor={0.08} enableZoom enableRotate enablePan minDistance={3} maxDistance={100} minPolarAngle={0.15} maxPolarAngle={Math.PI / 2 - 0.05} />
        </Canvas>
        {hasBuilding1 && (
          <div className="building-viewer__legend" aria-hidden="true">
            <span><i className="building-viewer__dot building-viewer__dot--running" /> Running</span>
            <span><i className="building-viewer__dot building-viewer__dot--off" /> Off</span>
            <span><i className="building-viewer__dot building-viewer__dot--fault" /> Fault</span>
            <span>Drag to rotate · Scroll to zoom</span>
          </div>
        )}
      </div>
      {hasBuilding1 && <SimulationPanel simulation={simulation} />}
    </div>
  );
}
