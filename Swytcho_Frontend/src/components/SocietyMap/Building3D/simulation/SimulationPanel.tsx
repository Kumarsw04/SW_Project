import type { DeviceStatus, SystemId } from "../infrastructure/types";
import type { BuildingSnapshot } from "./deriveBuilding";
import type { useBuildingSimulation } from "./useBuildingSimulation";
import PowerDistributionDiagram from "./PowerDistributionDiagram";

type Simulation = ReturnType<typeof useBuildingSimulation>;
interface Props {
  simulation: Simulation;
}

const DEVICE_ROWS: { id: SystemId; label: string; description: string }[] = [
  { id: "lift-1", label: "Lift 1", description: "Essential lift on DG" },
  { id: "lift-2", label: "Lift 2", description: "Shed on DG backup" },
  { id: "tank-pump", label: "Tank pump", description: "Rooftop water tank" },
  { id: "pool-pump", label: "Pool pump", description: "Swimming pool supply" },
  { id: "solar", label: "Solar PV", description: "Grid-tied demonstration" },
  { id: "ev-charger", label: "EV charger", description: "Shed on DG backup" },
];

function requestedStatus(simulation: Simulation, id: SystemId): DeviceStatus {
  switch (id) {
    case "dg": return simulation.systems.dg.status;
    case "lift-1": return simulation.systems.lifts[0];
    case "lift-2": return simulation.systems.lifts[1];
    case "tank-pump": return simulation.systems.pumps.tank;
    case "pool-pump": return simulation.systems.pumps.pool;
    case "solar": return simulation.systems.solar;
    case "ev-charger": return simulation.systems.evCharger;
  }
}

function effectiveStatus(snapshot: BuildingSnapshot, id: SystemId): DeviceStatus {
  switch (id) {
    case "lift-1": return snapshot.effective.lifts[0];
    case "lift-2": return snapshot.effective.lifts[1];
    case "tank-pump": return snapshot.effective.pumps.tank;
    case "pool-pump": return snapshot.effective.pumps.pool;
    case "solar": return snapshot.effective.solar;
    case "ev-charger": return snapshot.effective.evCharger;
    case "dg": return "off";
  }
}

export default function SimulationPanel({ simulation }: Props) {
  const { systems, snapshot, selectedSystem } = simulation;
  const dgRunning = snapshot.powerMode === "dg";
  const diesel = systems.dg.fuelPercent;
  return (
    <aside className="swytcho-controls" aria-label="Building 1 simulation controls">
      <div className="swytcho-controls__header">
        <div>
          <span className="swytcho-controls__eyebrow">SWYTCHO · INTERACTIVE DEMO</span>
          <h2>Building operations</h2>
        </div>
        <button className="swytcho-controls__reset" type="button" onClick={simulation.reset}>Reset</button>
      </div>

      <section className="swytcho-controls__section" aria-label="Power controls">
        <div className="swytcho-controls__section-head">
          <strong>Main electricity</strong>
          <span className={`swytcho-controls__pill swytcho-controls__pill--${systems.gridAvailable ? "running" : "fault"}`}>
            {systems.gridAvailable ? "GRID ON" : "GRID OFF"}
          </span>
        </div>
        <div className="swytcho-controls__buttons">
          <button type="button" className="swytcho-controls__button swytcho-controls__button--primary" onClick={simulation.toggleGrid}>
            {systems.gridAvailable ? "Cut main power" : "Restore main power"}
          </button>
        </div>
        <div className="swytcho-controls__metrics">
          <div><span>Power source</span><strong>{snapshot.powerMode === "grid" ? "MAIN GRID" : dgRunning ? "DIESEL DG" : "BLACKOUT"}</strong></div>
          <div><span>Building load</span><strong>{snapshot.activeLoadKw.toFixed(1)} kW</strong></div>
          <div><span>Solar generation</span><strong>{snapshot.solarOutputKw.toFixed(1)} kW</strong></div>
          <div><span>Grid import</span><strong>{snapshot.netGridKw.toFixed(1)} kW</strong></div>
          <div><span>DG output</span><strong>{snapshot.dgOutputKw.toFixed(1)} kW</strong></div>
          <div><span>Backup headroom</span><strong>{snapshot.dgReserveKw.toFixed(1)} kW</strong></div>
        </div>
      </section>

      <section className="swytcho-controls__section" aria-label="Electrical distribution map">
        <div className="swytcho-controls__section-head"><strong>Live electrical distribution (demo)</strong></div>
        <PowerDistributionDiagram snapshot={snapshot} />
      </section>

      <section className="swytcho-controls__section" aria-label="Diesel generator">
        <div className="swytcho-controls__section-head">
          <strong>Diesel Generator</strong>
          <span className={`swytcho-controls__pill swytcho-controls__pill--${systems.dg.status}`}>
            {dgRunning ? "BACKUP ACTIVE" : systems.dg.status === "fault" ? "FAULT" : "STANDBY"}
          </span>
        </div>
        <div className="swytcho-controls__fuel-title"><span>Diesel remaining</span><strong>{diesel.toFixed(1)}%</strong></div>
        <div className="swytcho-controls__fuel-track"><div className={`swytcho-controls__fuel-fill${diesel <= 25 ? " swytcho-controls__fuel-fill--low" : ""}`} style={{ width: `${diesel}%` }} /></div>
        <p className="swytcho-controls__hint">DG capacity: {snapshot.maximumBackupKw} kW (demo). {dgRunning ? `${snapshot.backupUtilizationPercent}% loaded.` : "Standby."} Fuel falls with simulated DG load (up to 1% / 5s at rated load).</p>
        <div className="swytcho-controls__buttons">
          <button type="button" className="swytcho-controls__button" onClick={simulation.useDiesel}>Use −10% fuel</button>
          <button type="button" className="swytcho-controls__button" onClick={simulation.refillDG}>Refill</button>
          <button type="button" className="swytcho-controls__button swytcho-controls__button--danger" onClick={() => simulation.setDevice("dg", systems.dg.status === "fault" ? "off" : "fault")}>
            {systems.dg.status === "fault" ? "Clear DG fault" : "Test DG fault"}
          </button>
        </div>
      </section>

      <section className="swytcho-controls__section" aria-label="Equipment controls">
        <div className="swytcho-controls__section-head"><strong>3D equipment controls</strong></div>
        {DEVICE_ROWS.map(({ id, label, description }) => {
          const requested = requestedStatus(simulation, id);
          const effective = effectiveStatus(snapshot, id);
          return (
            <div key={id} className={`swytcho-controls__device${selectedSystem === id ? " swytcho-controls__device--selected" : ""}`}>
              <div className="swytcho-controls__device-main">
                <button type="button" className="swytcho-controls__device-title" onClick={() => simulation.setSelectedSystem(id)} title="Highlight model status">
                  {label}
                </button>
                <span className={`swytcho-controls__pill swytcho-controls__pill--${effective}`}>
                  {effective === "running" ? "RUNNING" : effective === "fault" ? "FAULT" : "OFF"}
                </span>
              </div>
              <p className="swytcho-controls__hint">{description}{requested === "running" && effective === "off" ? " · Auto-shed / no supply" : ""}</p>
              <div className="swytcho-controls__buttons">
                {(["running", "off", "fault"] as DeviceStatus[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={requested === mode}
                    className={`swytcho-controls__button${requested === mode ? " swytcho-controls__button--chosen" : ""}`}
                    onClick={() => simulation.setDevice(id, mode)}
                  >
                    {mode === "running" ? "ON" : mode === "off" ? "OFF" : "Fault"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div className="swytcho-controls__buttons">
          <button type="button" className="swytcho-controls__button" onClick={() => simulation.setScheduleLiftFault(!simulation.scheduleLiftFault)}>
            {simulation.scheduleLiftFault ? "Cancel Lift 2 timer" : "Fault Lift 2 after 12s"}
          </button>
        </div>
      </section>

      <section className="swytcho-controls__section" aria-label="Visualization controls">
        <label className="swytcho-controls__check">
          <input type="checkbox" checked={simulation.showConnections} onChange={(event: { target: { checked: boolean } }) => simulation.setShowConnections(event.target.checked)} />
          Show animated current/water paths
        </label>
        <p className="swytcho-controls__hint">Green = active, red = stopped/faulted. Animated dots represent simulated flow, not live sensor data.</p>
      </section>

      <section className="swytcho-controls__section" aria-live="polite" aria-label="System alerts">
        <div className="swytcho-controls__section-head"><strong>Live simulation alerts ({snapshot.alerts.length})</strong></div>
        {snapshot.alerts.length === 0 ? (
          <p className="swytcho-controls__no-alerts">All simulated systems operating normally.</p>
        ) : (
          <ul className="swytcho-controls__alerts">
            {snapshot.alerts.map((alert) => <li key={alert.id} className={`swytcho-controls__alert swytcho-controls__alert--${alert.level}`}>{alert.text}</li>)}
          </ul>
        )}
      </section>
    </aside>
  );
}
