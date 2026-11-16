import type { BuildingSnapshot, PowerCircuitId } from "./deriveBuilding";

interface Props {
  snapshot: BuildingSnapshot;
}

const BRANCHES: PowerCircuitId[] = ["building", "lift-1", "lift-2", "tank-pump", "pool-pump", "ev-charger"];

/** Live electrical single-line *illustration* driven by the same calculation as the 3D wires. */
export default function PowerDistributionDiagram({ snapshot }: Props) {
  const { circuits, powerMode } = snapshot;
  return (
    <div className="swytcho-power" aria-label="Simulated electrical distribution">
      <div className="swytcho-power__sources">
        {(["grid", "dg", "solar"] as const).map((id) => {
          const c = circuits[id];
          return (
            <div key={id} className={`swytcho-power__source swytcho-power__source--${id}${c.status === "running" ? " swytcho-power__source--live" : ""}`}>
              <span className="swytcho-power__source-name">{c.label}</span>
              <strong>{c.kw.toFixed(1)} kW</strong>
              <small>{c.status === "running" ? "SUPPLYING" : c.status === "fault" ? "FAULT" : "INACTIVE"}</small>
            </div>
          );
        })}
      </div>
      <div className={`swytcho-power__bus swytcho-power__bus--${powerMode}`}>
        <span aria-hidden="true" className="swytcho-power__bus-indicator" />
        MAIN DISTRIBUTION BOARD
        <strong>{snapshot.activeLoadKw.toFixed(1)} kW</strong>
      </div>
      <div className="swytcho-power__branch-grid">
        {BRANCHES.map((id) => {
          const c = circuits[id];
          return (
            <div key={id} className={`swytcho-power__branch swytcho-power__branch--${c.status}`}>
              <span className="swytcho-power__branch-line" aria-hidden="true" />
              <div className="swytcho-power__branch-details">
                <strong>{c.label}</strong>
                <span>{c.kw.toFixed(1)} kW {c.shed ? "· SHED" : c.status === "fault" ? "· FAULT" : c.status === "off" ? "· OFF" : "· LIVE"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="swytcho-controls__hint">Animated lines and circuit values are simulated. Grid, DG and solar supply feed the MDB; loads branch out to building equipment.</p>
    </div>
  );
}
