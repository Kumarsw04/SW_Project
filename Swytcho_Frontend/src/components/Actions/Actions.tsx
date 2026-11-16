import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BatteryFull,
  Building2,
  CheckCircle2,
  CircleOff,
  Droplets,
  Fuel,
  Gauge,
  RotateCcw,
  ShieldAlert,
  Sun,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { DeviceStatus, SystemId } from "../SocietyMap/Building3D/infrastructure/types";
import { useBuildingSimulationContext } from "../SocietyMap/Building3D/simulation/BuildingSimulationContext";
import { useActiveBuildingAlerts } from "../SocietyMap/Building3D/alerts/useActiveBuildingAlerts";
import "./Actions.css";

interface ActionsProps {
  locationName?: string;
  buildingName?: string;
  onNavigate?: (path: string) => void;
}

type EquipmentId = Exclude<SystemId, "dg">;

type Equipment = {
  id: EquipmentId;
  title: string;
  description: string;
  icon: LucideIcon;
};

const EQUIPMENT_GROUPS: { heading: string; items: Equipment[] }[] = [
  {
    heading: "Vertical transport",
    items: [
      { id: "lift-1", title: "Lift 1", description: "Essential lift · stays enabled on DG backup", icon: Building2 },
      { id: "lift-2", title: "Lift 2", description: "Nonessential lift · auto-shed on DG backup", icon: Building2 },
    ],
  },
  {
    heading: "Water management",
    items: [
      { id: "tank-pump", title: "Rooftop tank pump", description: "Feeds the building water tank · backup priority", icon: Droplets },
      { id: "pool-pump", title: "Swimming pool pump", description: "Pool circulation · auto-shed on DG backup", icon: Waves },
    ],
  },
  {
    heading: "Generation and charging",
    items: [
      { id: "solar", title: "Solar panels", description: "Grid-tied solar generation in this simulation", icon: Sun },
      { id: "ev-charger", title: "EV charging station", description: "Charging circuit · auto-shed on DG backup", icon: BatteryFull },
    ],
  },
];

function getRequestedStatus(systems: ReturnType<typeof useBuildingSimulationContext>["systems"], id: EquipmentId): DeviceStatus {
  switch (id) {
    case "lift-1": return systems.lifts[0];
    case "lift-2": return systems.lifts[1];
    case "tank-pump": return systems.pumps.tank;
    case "pool-pump": return systems.pumps.pool;
    case "solar": return systems.solar;
    case "ev-charger": return systems.evCharger;
  }
}

function statusName(status: DeviceStatus): string {
  return status === "running" ? "RUNNING" : status === "fault" ? "FAULT" : "OFF";
}

export default function Actions({
  locationName = "Bhubaneswar",
  buildingName = "Building 1",
  onNavigate,
}: ActionsProps) {
  const simulation = useBuildingSimulationContext();
  const activeAlerts = useActiveBuildingAlerts();
  const { systems, snapshot } = simulation;
  const [confirmReset, setConfirmReset] = useState(false);
  const sourceLabel = snapshot.powerMode === "grid"
    ? "MAIN GRID"
    : snapshot.powerMode === "dg"
      ? "DG BACKUP"
      : "NO POWER";

  return (
    <main className="sw-actions-page">
      <div className="sw-actions-page__breadcrumb">
        <span>{locationName}</span><span aria-hidden="true">/</span><span>Monitoring</span>
      </div>

      <header className="sw-actions-page__heading">
        <div>
          <p className="sw-actions-page__eyebrow">BUILDING OPERATIONS · SIMULATION</p>
          <h1>Actions</h1>
          <p>Control {buildingName} equipment. Changes appear in the 3D model and in Alerts automatically.</p>
        </div>
        <div className="sw-actions-page__header-actions">
          <button type="button" className="sw-actions-page__btn sw-actions-page__btn--ghost" onClick={() => onNavigate?.("/society-map")} disabled={!onNavigate}>
            <Building2 size={16} /> View 3D model <ArrowRight size={15} />
          </button>
          <button type="button" className="sw-actions-page__btn sw-actions-page__btn--ghost" onClick={() => onNavigate?.("/alerts")} disabled={!onNavigate}>
            <AlertTriangle size={16} /> Alerts ({activeAlerts.length})
          </button>
        </div>
      </header>

      <section className="sw-actions-page__overview" aria-label="Power and alert summary">
        <div className="sw-actions-page__metric">
          <span><Zap size={16} /> Power source</span>
          <strong className={snapshot.powerMode === "none" ? "sw-actions-page__text-danger" : ""}>{sourceLabel}</strong>
          <small>{systems.gridAvailable ? "Main supply available" : "Main supply disconnected"}</small>
        </div>
        <div className="sw-actions-page__metric">
          <span><Gauge size={16} /> Building load</span>
          <strong>{snapshot.activeLoadKw.toFixed(1)} <em>kW</em></strong>
          <small>{snapshot.powerMode === "dg" ? `${snapshot.dgReserveKw.toFixed(1)} kW backup headroom` : "Estimated simulation demand"}</small>
        </div>
        <div className="sw-actions-page__metric">
          <span><Fuel size={16} /> DG fuel level</span>
          <strong>{systems.dg.fuelPercent.toFixed(1)}<em>%</em></strong>
          <small>{snapshot.powerMode === "dg" ? "Generator is supplying backup" : "Fuel reserve"}</small>
        </div>
        <div className="sw-actions-page__metric sw-actions-page__metric--alerts">
          <span><ShieldAlert size={16} /> Active alerts</span>
          <strong>{activeAlerts.length}</strong>
          <small>Shown in the sidebar and Alerts page</small>
        </div>
      </section>

      <div className="sw-actions-page__columns">
        <div className="sw-actions-page__main">
          <section className="sw-actions-page__section" aria-labelledby="sw-actions-grid-heading">
            <div className="sw-actions-page__section-heading">
              <div>
                <h2 id="sw-actions-grid-heading">Main electricity</h2>
                <p>Simulate a grid failure. The DG attempts to start automatically after a short blackout.</p>
              </div>
              <span className={`sw-actions-page__pill sw-actions-page__pill--${systems.gridAvailable ? "running" : "off"}`}>
                {systems.gridAvailable ? "GRID ON" : "GRID OFF"}
              </span>
            </div>
            <div className="sw-actions-page__actions-row">
              <button
                type="button"
                className={`sw-actions-page__btn ${systems.gridAvailable ? "sw-actions-page__btn--danger" : "sw-actions-page__btn--primary"}`}
                onClick={simulation.toggleGrid}
              >
                <Zap size={16} /> {systems.gridAvailable ? "Cut main power" : "Restore main power"}
              </button>
            </div>
            {!systems.gridAvailable && (
              <p className="sw-actions-page__note" role="status">
                {snapshot.powerMode === "dg"
                  ? `DG backup active: ${snapshot.dgOutputKw.toFixed(1)} of ${snapshot.maximumBackupKw} kW in use. Nonessential loads are automatically shed.`
                  : "Main grid is off. Essential circuits are without power until backup becomes available."}
              </p>
            )}
          </section>

          <section className="sw-actions-page__section" aria-labelledby="sw-actions-dg-heading">
            <div className="sw-actions-page__section-heading">
              <div>
                <h2 id="sw-actions-dg-heading">Diesel generator</h2>
                <p>Fuel and failure controls for the {snapshot.maximumBackupKw} kW demo generator.</p>
              </div>
              <span className={`sw-actions-page__pill sw-actions-page__pill--${systems.dg.status === "fault" ? "fault" : snapshot.powerMode === "dg" ? "running" : "off"}`}>
                {systems.dg.status === "fault" ? "FAULT" : snapshot.powerMode === "dg" ? "BACKUP ACTIVE" : "STANDBY"}
              </span>
            </div>
            <div className="sw-actions-page__fuel-heading"><span>Diesel remaining</span><strong>{systems.dg.fuelPercent.toFixed(1)}%</strong></div>
            <div className="sw-actions-page__fuel-track" role="progressbar" aria-label="Diesel fuel remaining" aria-valuemin={0} aria-valuemax={100} aria-valuenow={systems.dg.fuelPercent}>
              <div className={`sw-actions-page__fuel-fill ${systems.dg.fuelPercent <= 25 ? "sw-actions-page__fuel-fill--low" : ""}`} style={{ width: `${systems.dg.fuelPercent}%` }} />
            </div>
            <div className="sw-actions-page__actions-row">
              <button type="button" className="sw-actions-page__btn sw-actions-page__btn--ghost" onClick={simulation.useDiesel}>Use 10% fuel</button>
              <button type="button" className="sw-actions-page__btn sw-actions-page__btn--ghost" onClick={simulation.refillDG}>Refill to 100%</button>
              <button
                type="button"
                className={`sw-actions-page__btn ${systems.dg.status === "fault" ? "sw-actions-page__btn--primary" : "sw-actions-page__btn--danger"}`}
                onClick={() => simulation.setDevice("dg", systems.dg.status === "fault" ? "off" : "fault")}
              >
                {systems.dg.status === "fault" ? "Clear DG fault" : "Simulate DG fault"}
              </button>
            </div>
            <p className="sw-actions-page__hint">In this simulation the DG cannot be manually forced to run while grid power is available.</p>
          </section>

          {EQUIPMENT_GROUPS.map(({ heading, items }) => (
            <section key={heading} className="sw-actions-page__section" aria-label={heading}>
              <div className="sw-actions-page__section-heading"><h2>{heading}</h2></div>
              <div className="sw-actions-page__devices">
                {items.map(({ id, title, description, icon: Icon }) => {
                  const requested = getRequestedStatus(systems, id);
                  const reading = snapshot.circuits[id];
                  const effective = reading.status;
                  return (
                    <article className="sw-actions-page__device" key={id}>
                      <div className="sw-actions-page__device-info">
                        <div className="sw-actions-page__device-icon"><Icon size={19} /></div>
                        <div className="sw-actions-page__device-copy">
                          <h3>{title}</h3>
                          <p>{description}</p>
                          <small>{reading.kw.toFixed(1)} kW now{reading.shed ? " · Automatically disconnected by power management" : ""}</small>
                        </div>
                      </div>
                      <div className="sw-actions-page__device-control">
                        <span className={`sw-actions-page__pill sw-actions-page__pill--${effective}`}>{statusName(effective)}{reading.shed ? " · SHED" : ""}</span>
                        <div className="sw-actions-page__segmented" role="group" aria-label={`${title} manual control`}>
                          {(["running", "off", "fault"] as const).map((status) => (
                            <button
                              type="button"
                              key={status}
                              className={`sw-actions-page__segment${requested === status ? ` sw-actions-page__segment--${status}` : ""}`}
                              aria-pressed={requested === status}
                              onClick={() => simulation.setDevice(id, status)}
                            >
                              {status === "running" ? "ON" : status === "off" ? "OFF" : "Fault"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="sw-actions-page__side" aria-label="Automation and safety controls">
          <section className="sw-actions-page__section">
            <div className="sw-actions-page__section-heading"><h2>Automatic test</h2></div>
            <div className="sw-actions-page__callout"><Activity size={18} /><p>Schedule a simulated Lift 2 malfunction after 12 seconds. A fault alert will appear automatically.</p></div>
            <button
              type="button"
              className="sw-actions-page__btn sw-actions-page__btn--ghost sw-actions-page__btn--wide"
              onClick={() => simulation.setScheduleLiftFault(!simulation.scheduleLiftFault)}
            >
              {simulation.scheduleLiftFault ? "Cancel Lift 2 fault timer" : "Fault Lift 2 after 12 seconds"}
            </button>
          </section>
          <section className="sw-actions-page__section">
            <div className="sw-actions-page__section-heading"><h2>Model visualization</h2></div>
            <label className="sw-actions-page__switch-line">
              <input type="checkbox" checked={simulation.showConnections} onChange={(event) => simulation.setShowConnections(event.target.checked)} />
              <span>Show electrical and water flow lines</span>
            </label>
            <p className="sw-actions-page__hint">The setting is shared with the 3D viewer.</p>
          </section>
          <section className="sw-actions-page__section">
            <div className="sw-actions-page__section-heading"><h2>Active conditions</h2></div>
            <div className="sw-actions-page__condition-list" aria-live="polite">
              {activeAlerts.length === 0 ? (
                <p className="sw-actions-page__all-clear"><CheckCircle2 size={18} /> No active simulation alerts.</p>
              ) : (
                activeAlerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="sw-actions-page__condition">
                    {alert.severity === "critical" ? <CircleOff size={16} /> : <AlertTriangle size={16} />}
                    <span>{alert.title}</span>
                  </div>
                ))
              )}
            </div>
            {activeAlerts.length > 4 && <p className="sw-actions-page__hint">+{activeAlerts.length - 4} more in Alerts.</p>}
            <button type="button" className="sw-actions-page__btn sw-actions-page__btn--ghost sw-actions-page__btn--wide" disabled={!onNavigate} onClick={() => onNavigate?.("/alerts")}>Open Alerts <ArrowRight size={15} /></button>
          </section>
          <section className="sw-actions-page__section">
            <div className="sw-actions-page__section-heading"><h2>Reset simulation</h2></div>
            <p className="sw-actions-page__hint">Reset restores the main grid, clears faults and shutdowns, refills DG fuel and cancels any scheduled fault.</p>
            {confirmReset ? (
              <div className="sw-actions-page__actions-row">
                <button type="button" className="sw-actions-page__btn sw-actions-page__btn--danger" onClick={() => { simulation.reset(); setConfirmReset(false); }}><RotateCcw size={15} /> Confirm reset</button>
                <button type="button" className="sw-actions-page__btn sw-actions-page__btn--ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              </div>
            ) : (
              <button type="button" className="sw-actions-page__btn sw-actions-page__btn--ghost sw-actions-page__btn--wide" onClick={() => setConfirmReset(true)}><RotateCcw size={15} /> Reset all demo equipment</button>
            )}
          </section>
        </aside>
      </div>
      <p className="sw-actions-page__disclaimer">Simulation only. These controls do not operate real-world electrical or mechanical equipment. Automatic DG changeover and circuit ratings are illustrative.</p>
    </main>
  );
}
