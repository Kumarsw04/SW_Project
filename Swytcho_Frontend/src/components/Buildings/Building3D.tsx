import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './Building3D.css';

type Flat = { id: string; loadKw: number; meterStatus: 'Online' | 'Offline'; energyTodayKwh: number ;costToday: number; };
type FloorData = { floor: number; loadKw: number; flats: Flat[]; energyTodayKwh: number; peakLoadKw: number; costToday: number; };

type Building3DProps = {
  /** Put the uploaded GLB at public/models/residential-building.glb */
  modelUrl?: string;
  /** Replace this demo data with your API/database response. */
  floorCount?: number;
  flatsPerFloor?: number;
  onFlatSelect?: (flat: Flat, floor: number) => void;
};

const makeDemoData = (
  floorCount: number,
  flatsPerFloor: number
): FloorData[] =>
  Array.from({ length: floorCount }, (_, index) => {
    const floor = index + 1;

    const flats: Flat[] = Array.from(
      { length: flatsPerFloor },
      (_, flatIndex) => {
        const loadKw = Number(
          (0.35 + ((floor * 7 + flatIndex * 3) % 21) / 10).toFixed(2)
        );

        const energyTodayKwh = Number((loadKw * 4.2).toFixed(2));

        return {
          id: `${floor === 1 ? 'G' : floor - 1}${String.fromCharCode(65 + flatIndex)}`,
          loadKw,
          meterStatus:
            (flatIndex + floor) % 7 === 0 ? 'Offline' : 'Online',
          energyTodayKwh,
          costToday: Number((energyTodayKwh * 6.5).toFixed(2)),
        };
      }
    );

    const loadKw = Number(
      flats.reduce((sum, flat) => sum + flat.loadKw, 0).toFixed(2)
    );

    return {
      floor,
      loadKw,
      flats,
      energyTodayKwh: Number(
        flats
          .reduce((sum, flat) => sum + flat.energyTodayKwh, 0)
          .toFixed(2)
      ),
      peakLoadKw: Number((loadKw * 1.25).toFixed(2)),
      costToday: Number(
        flats.reduce((sum, flat) => sum + flat.costToday, 0).toFixed(2)
      ),
    };
  });

function BuildingModel({
  modelUrl,
  floors,
  selectedFloor,
  onFloorClick,
}: {
  modelUrl: string;
  floors: FloorData[];
  selectedFloor: number | null;
  onFloorClick: (floor: number) => void;
}) {
  const { scene } = useGLTF(modelUrl);
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(cloned);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const safeHeight = Math.max(size.y, 0.001);
    const scale = 5.6 / safeHeight;

    // Normalize model size and center it so the interaction zones align with it.
    cloned.position.sub(center);

    return {
      object: cloned,
      width: Math.max(size.x, 0.1),
      height: safeHeight,
      depth: Math.max(size.z, 0.1),
      scale,
    };
  }, [scene]);

  const { object, width, height, depth, scale } = model;
  const floorPositions = [    -0.43, -0.29, -0.15, -0.01, 0.13, 0.27, 0.41,].map((position) => position * height);
if (floors.length !== floorPositions.length) {
  console.warn(
    `Building has ${floorPositions.length} calibrated floor positions, ` +
    `but received ${floors.length} floors.`
  );
}
  const clickableWidth = width * 1.08;
  const clickableDepth = depth * 1.08;
  const dotX = width * 0.38;
  const dotZ = depth * 0.53;

  return (
    <group scale={scale}>
      <primitive object={object} />
      {floors.map((floorData, index) => {
        // Floor zones are transparent hit targets; the GLB stays visually unchanged.
        const y = floorPositions[index] ?? 0;
        const isSelected = selectedFloor === floorData.floor;
        // Calculate the clickable zone height from adjacent floor positions.
        const previousY = index > 0 ? floorPositions[index - 1] : y - (floorPositions[index + 1] - y);
        const nextY = index < floorPositions.length - 1 ? floorPositions[index + 1] : y + (y - floorPositions[index - 1]);
        const zoneHeight = Math.min(Math.abs(y - previousY), Math.abs(nextY - y)) * 0.9;

        return (
          <group key={floorData.floor}>
            <mesh
              position={[0, y, 0]}
              onClick={(event) => {
                event.stopPropagation();
                onFloorClick(floorData.floor);
              }}
              onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
              <boxGeometry args={[clickableWidth, zoneHeight, clickableDepth]}/>
              <meshBasicMaterial
                color={isSelected ? '#45d6b5' : '#ffffff'}
                transparent
                opacity={isSelected ? 0.12 : 0.001}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            <Html
              position={[dotX, y, dotZ]}
              center
              distanceFactor={9}
              occlude={false}
              zIndexRange={[30, 0]}
            >
              <button
                className={`building-flat-dot ${isSelected ? 'is-selected' : ''}`}
                title={floorData.floor === 1  ? 'Show Ground Floor flats' : `Show Floor ${floorData.floor - 1} flats`}
                aria-label={floorData.floor === 1 ? 'Show Ground Floor flats' : `Show Floor ${floorData.floor - 1} flats`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onFloorClick(floorData.floor);
                }}
              />
            </Html>
          </group>
        );
      })}

      {selectedFloor !== null && (
        <Html position={[0, floorPositions[selectedFloor - 1] ?? 0, depth * 0.7]} center>
          <div className="building-floor-tag">{selectedFloor === 1 ? 'Ground Floor' : `Floor ${selectedFloor - 1}`}</div>
        </Html>
      )}
    </group>
  );
}

export default function Building3D({
  modelUrl = '/models/residential-building.glb',
  floorCount = 7,
  flatsPerFloor = 3,
  onFlatSelect,
}: Building3DProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const floors = useMemo(() => makeDemoData(floorCount, flatsPerFloor), [floorCount, flatsPerFloor]);
  const activeFloor = floors.find((floor) => floor.floor === selectedFloor) ?? null;

  const selectFloor = (floor: number) => {
    setSelectedFloor(floor);
    setSelectedFlat(null);
  };

  const selectFlat = (flat: Flat) => {
    setSelectedFlat(flat);
    if (selectedFloor !== null) onFlatSelect?.(flat, selectedFloor);
  };

  return (
    <section className="building3d-card">
      <header className="building3d-header">
        <div>
          <p className="building3d-eyebrow">SWYTCHO · LIVE BUILDING</p>
          <h2>Building energy overview</h2>
          <p className="building3d-subtitle">Select a floor or tap a dot to explore its flats.</p>
        </div>
        <span className="building3d-live"><i /> Demo data</span>
      </header>

      <div className="building3d-content">
        <div className="building3d-viewer">
          <Canvas camera={{ position: [9, 7, 11], fov: 36 }} dpr={[1, 1.75]}>
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={1.8} />
            <directionalLight position={[8, 12, 7]} intensity={2.3} />
            <directionalLight position={[-8, 5, -5]} intensity={0.8} />
            <Suspense fallback={<Html center><div className="building3d-loading">Loading building…</div></Html>}>
              <BuildingModel
                modelUrl={modelUrl}
                floors={floors}
                selectedFloor={selectedFloor}
                onFloorClick={selectFloor}
              />
            </Suspense>
            <OrbitControls makeDefault enableDamping minDistance={6} maxDistance={24} maxPolarAngle={Math.PI / 2 + 0.08} />
          </Canvas>
          <div className="building3d-hint">Drag to rotate · Scroll to zoom · Click a floor</div>
        </div>

        <aside className="building3d-details">
          {!activeFloor ? (
            <div className="building3d-empty">
              <span className="building3d-empty-icon">⌁</span>
              <h3>Select a floor</h3>
              <p>Its current load and available flats will appear here.</p>
            </div>
          ) : (
            <>
              <div className="building3d-detail-heading">
                <div><span className="building3d-label">SELECTED FLOOR</span><h3>{activeFloor.floor === 1 ? 'Ground Floor' : `Floor ${activeFloor.floor - 1}`}</h3></div>
                <span className="building3d-status"><i /> Monitoring</span>
              </div>
              <div className="building3d-load-card">
                <span>Current floor load</span>
                <strong>{activeFloor.loadKw.toFixed(2)} <small>kW</small></strong>
                <div className="building3d-load-track"><span style={{ width: `${Math.min(activeFloor.loadKw / Math.max(flatsPerFloor * 3, 1) * 100, 100)}%` }} /></div>
                <small className="building3d-demo-note">Illustrative values — connect your meter API for live readings.</small>
              </div>
              <div className="building3d-stats-grid">
                <div className="building3d-stat-card">
                  <span>Energy today</span>
                  <strong>{activeFloor.energyTodayKwh.toFixed(2)} kWh</strong>
                </div>
                <div className="building3d-stat-card">
                  <span>Peak load</span>
                  <strong>{activeFloor.peakLoadKw.toFixed(2)} kW</strong>
                </div>
                <div className="building3d-stat-card">
                  <span>Estimated cost today</span>
                  <strong>₹{activeFloor.costToday.toFixed(2)}</strong>
                </div>
                <div className="building3d-stat-card">
                  <span>Meters online</span>
                  <strong>
                    {activeFloor.flats.filter((flat) => flat.meterStatus === 'Online').length} / {activeFloor.flats.length}
                  </strong>
                </div>
              </div>
              <div className="building3d-flats-heading"><h4>Flats on this floor</h4><span>{activeFloor.flats.length} units</span></div>
              <div className="building3d-flat-list">
                {activeFloor.flats.map((flat) => (
                  <button key={flat.id} className={`building3d-flat-row ${selectedFlat?.id === flat.id ? 'is-active' : ''}`} onClick={() => selectFlat(flat)}>
                    <span className="building3d-flat-symbol">⌂</span>
                    <span className="building3d-flat-name"><strong>Flat {flat.id}</strong><small><i className={flat.meterStatus === 'Online' ? 'online' : 'offline'} /> Meter {flat.meterStatus}</small></span>
                    <span className="building3d-flat-metrics">
                      <strong>{flat.loadKw.toFixed(2)} <small>kW</small></strong>
                      <small>{flat.energyTodayKwh.toFixed(2)} kWh today</small>
                      <small>₹{flat.costToday.toFixed(2)} today</small>
                    </span>

                  </button>
                ))}
              </div>
              {selectedFlat && (
                <div className="building3d-selected-flat">
                  <span>SELECTED FLAT</span>
                  <strong>Flat {selectedFlat.id} · {selectedFlat.loadKw.toFixed(2)} kW</strong>
                  <p>Meter status: {selectedFlat.meterStatus}</p>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

useGLTF.preload('/models/residential-building.glb');
