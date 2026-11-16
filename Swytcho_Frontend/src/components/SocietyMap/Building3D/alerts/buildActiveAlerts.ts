import type { BuildingSystemsState, DeviceStatus, SystemId } from "../infrastructure/types";
import { deriveBuilding } from "../simulation/deriveBuilding";

export type BuildingAlertSeverity = "warning" | "critical";
export interface ActiveBuildingAlert {
  id: string;
  title: string;
  message: string;
  severity: BuildingAlertSeverity;
  equipment: SystemId | "grid";
}

/**
 * One active alert per affected equipment, not per log message.
 * Automatically load-shed devices do not count as manually switched OFF.
 * A DG in normal standby is not an alert.
 */
export function buildActiveAlerts(state: BuildingSystemsState): ActiveBuildingAlert[] {
  const alerts: ActiveBuildingAlert[] = [];
  const { powerMode } = deriveBuilding(state);

  if (!state.gridAvailable) {
    alerts.push({
      id: "grid-off",
      title: "Main grid switched OFF",
      message: powerMode === "dg"
        ? "Main power is disconnected; the DG is supplying essential circuits."
        : "Main power is disconnected and the building is awaiting or missing backup power.",
      severity: powerMode === "none" ? "critical" : "warning",
      equipment: "grid",
    });
  }

  function equipmentAlert(id: SystemId, name: string, status: DeviceStatus) {
    if (status === "running") return;
    alerts.push({
      id: `${id}-${status}`,
      title: `${name} ${status === "off" ? "switched OFF" : "fault detected"}`,
      message: status === "off"
        ? `${name} was manually switched OFF in the building simulation.`
        : `${name} is in a simulated fault state and requires attention.`,
      severity: status === "fault" ? "critical" : "warning",
      equipment: id,
    });
  }

  // DG is normally OFF when the grid is available. Only report its fault,
  // rather than counting standby as a shutdown.
  if (state.dg.status === "fault") equipmentAlert("dg", "Diesel generator", "fault");
  equipmentAlert("lift-1", "Lift 1", state.lifts[0]);
  equipmentAlert("lift-2", "Lift 2", state.lifts[1]);
  equipmentAlert("tank-pump", "Water tank pump", state.pumps.tank);
  equipmentAlert("pool-pump", "Swimming pool pump", state.pumps.pool);
  equipmentAlert("solar", "Solar panels", state.solar);
  equipmentAlert("ev-charger", "EV charging station", state.evCharger);

  if (state.dg.fuelPercent <= 25) {
    alerts.push({
      id: "dg-low-fuel",
      title: state.dg.fuelPercent <= 0 ? "DG fuel empty" : "DG fuel low",
      message: `Diesel remaining: ${state.dg.fuelPercent.toFixed(1)}%. Refill the simulated tank.`,
      severity: state.dg.fuelPercent <= 0 ? "critical" : "warning",
      equipment: "dg",
    });
  }
  return alerts;
}
