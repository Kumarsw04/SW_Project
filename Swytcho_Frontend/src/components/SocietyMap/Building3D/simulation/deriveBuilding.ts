import type { BuildingSystemsState, DeviceStatus, SystemId } from "../infrastructure/types";

export type PowerMode = "grid" | "dg" | "none";
export type AlertLevel = "info" | "warning" | "critical";
export type PowerCircuitId = "grid" | "dg" | "solar" | "building" | Exclude<SystemId, "dg" | "solar">;

export interface SimulationAlert {
  id: string;
  level: AlertLevel;
  text: string;
}

export interface CircuitReading {
  id: PowerCircuitId;
  label: string;
  status: DeviceStatus;
  kw: number;
  priority: "source" | "essential" | "normal";
  /** If the user requested ON but backup logic shed the device, this is true. */
  shed: boolean;
}

export interface BuildingSnapshot {
  powerMode: PowerMode;
  maximumBackupKw: number;
  activeLoadKw: number;
  netGridKw: number;
  dgOutputKw: number;
  dgReserveKw: number;
  solarOutputKw: number;
  backupUtilizationPercent: number;
  circuits: Record<PowerCircuitId, CircuitReading>;
  effective: {
    lifts: [DeviceStatus, DeviceStatus];
    pumps: { tank: DeviceStatus; pool: DeviceStatus };
    solar: DeviceStatus;
    evCharger: DeviceStatus;
  };
  alerts: SimulationAlert[];
}

/** Illustrative ratings, not equipment specification or engineering calculations. */
export const BACKUP_CAPACITY_KW = 16;
const ESSENTIAL_BUILDING_KW = 4.5;
const EQUIPMENT_KW = {
  "lift-1": 3,
  "lift-2": 3,
  "tank-pump": 2,
  "pool-pump": 2.5,
  "ev-charger": 7,
} as const;

const round = (value: number) => Math.round(value * 10) / 10;
const capOff = (requested: DeviceStatus, allowed: boolean): DeviceStatus =>
  requested === "fault" ? "fault" : allowed ? requested : "off";

/**
 * Pure calculation shared by the control panel and 3D model.
 * Solar is grid-tied only. DG backup prioritizes essential lighting,
 * Lift 1 and the water-tank pump. Normal loads are shed on DG.
 */
export function deriveBuilding(state: BuildingSystemsState): BuildingSnapshot {
  const powerMode: PowerMode = state.gridAvailable
    ? "grid"
    : state.dg.status === "running" && state.dg.fuelPercent > 0
      ? "dg"
      : "none";
  const powered = powerMode !== "none";
  const gridMode = powerMode === "grid";

  let backupRemaining = powerMode === "dg" ? BACKUP_CAPACITY_KW : 0;
  const essentialKw = powered ? ESSENTIAL_BUILDING_KW : 0;
  if (powerMode === "dg") backupRemaining -= essentialKw;

  // Reserve backup power in priority order: Lift 1, then tank pump.
  // Faults remain faults even when there is no power.
  const allowEssential = (requested: DeviceStatus, kw: number): DeviceStatus => {
    if (!powered) return capOff(requested, false);
    if (gridMode) return requested;
    if (requested !== "running") return requested;
    if (backupRemaining < kw) return "off";
    backupRemaining -= kw;
    return "running";
  };

  const effective = {
    lifts: [
      allowEssential(state.lifts[0], EQUIPMENT_KW["lift-1"]),
      capOff(state.lifts[1], gridMode),
    ] as [DeviceStatus, DeviceStatus],
    pumps: {
      tank: allowEssential(state.pumps.tank, EQUIPMENT_KW["tank-pump"]),
      pool: capOff(state.pumps.pool, gridMode),
    },
    solar: capOff(state.solar, gridMode),
    evCharger: capOff(state.evCharger, gridMode),
  };

  const deviceConsumption = {
    "lift-1": effective.lifts[0] === "running" ? EQUIPMENT_KW["lift-1"] : 0,
    "lift-2": effective.lifts[1] === "running" ? EQUIPMENT_KW["lift-2"] : 0,
    "tank-pump": effective.pumps.tank === "running" ? EQUIPMENT_KW["tank-pump"] : 0,
    "pool-pump": effective.pumps.pool === "running" ? EQUIPMENT_KW["pool-pump"] : 0,
    "ev-charger": effective.evCharger === "running" ? EQUIPMENT_KW["ev-charger"] : 0,
  };
  const activeLoadKw = round(essentialKw + Object.values(deviceConsumption).reduce((a, b) => a + b, 0));
  const solarOutputKw = effective.solar === "running" ? 3.2 : 0;
  const netGridKw = gridMode ? round(Math.max(0, activeLoadKw - solarOutputKw)) : 0;
  const dgOutputKw = powerMode === "dg" ? activeLoadKw : 0;
  const dgReserveKw = round(powerMode === "dg" ? Math.max(0, BACKUP_CAPACITY_KW - dgOutputKw) : BACKUP_CAPACITY_KW);
  const backupUtilizationPercent = Math.round((dgOutputKw / BACKUP_CAPACITY_KW) * 100);

  const circuit = (
    id: PowerCircuitId, label: string, status: DeviceStatus, kw: number,
    priority: CircuitReading["priority"], shed = false,
  ): CircuitReading => ({ id, label, status, kw: round(kw), priority, shed });

  const circuits: Record<PowerCircuitId, CircuitReading> = {
    grid: circuit("grid", "Main grid", netGridKw > 0 ? "running" : "off", netGridKw, "source"),
    dg: circuit("dg", "Diesel generator", dgOutputKw > 0 ? "running" : state.dg.status === "fault" ? "fault" : "off", dgOutputKw, "source"),
    solar: circuit("solar", "Solar PV", effective.solar, solarOutputKw, "source"),
    building: circuit("building", "Essential building", powered ? "running" : "off", essentialKw, "essential"),
    "lift-1": circuit("lift-1", "Lift 1", effective.lifts[0], deviceConsumption["lift-1"], "essential", state.lifts[0] === "running" && effective.lifts[0] === "off"),
    "lift-2": circuit("lift-2", "Lift 2", effective.lifts[1], deviceConsumption["lift-2"], "normal", state.lifts[1] === "running" && effective.lifts[1] === "off"),
    "tank-pump": circuit("tank-pump", "Water tank pump", effective.pumps.tank, deviceConsumption["tank-pump"], "essential", state.pumps.tank === "running" && effective.pumps.tank === "off"),
    "pool-pump": circuit("pool-pump", "Pool pump", effective.pumps.pool, deviceConsumption["pool-pump"], "normal", state.pumps.pool === "running" && effective.pumps.pool === "off"),
    "ev-charger": circuit("ev-charger", "EV charger", effective.evCharger, deviceConsumption["ev-charger"], "normal", state.evCharger === "running" && effective.evCharger === "off"),
  };

  const alerts: SimulationAlert[] = [];
  if (powerMode === "none") {
    alerts.push({
      id: "blackout", level: "critical",
      text: state.dg.status === "fault"
        ? "Grid unavailable and DG faulted: all building circuits unpowered."
        : state.dg.fuelPercent <= 0
          ? "Grid unavailable and DG fuel empty: all circuits unpowered."
          : "Grid disconnected. DG auto-start pending (simulated 1.8-second delay).",
    });
  } else if (powerMode === "dg") {
    alerts.push({
      id: "backup", level: "warning",
      text: `DG supplying ${dgOutputKw.toFixed(1)} kW of ${BACKUP_CAPACITY_KW} kW. ${dgReserveKw.toFixed(1)} kW available; Lift 2, pool pump and EV charging are shed.`,
    });
  }
  if (state.dg.status === "fault") {
    alerts.push({ id: "dg-fault", level: "critical", text: "DG fault simulated. Clear fault to enable automatic backup." });
  }
  if (state.dg.fuelPercent <= 25) {
    alerts.push({ id: "fuel", level: state.dg.fuelPercent === 0 ? "critical" : "warning", text: `DG diesel low: ${round(state.dg.fuelPercent)}%. Refill required.` });
  }

  const requests: [SystemId, DeviceStatus, string][] = [
    ["lift-1", state.lifts[0], "Lift 1"],
    ["lift-2", state.lifts[1], "Lift 2"],
    ["tank-pump", state.pumps.tank, "Water tank pump"],
    ["pool-pump", state.pumps.pool, "Swimming pool pump"],
    ["solar", state.solar, "Solar array"],
    ["ev-charger", state.evCharger, "EV charger"],
  ];
  for (const [id, requested, label] of requests) {
    if (requested === "fault") {
      alerts.push({ id: `${id}-fault`, level: "critical", text: `${label} fault: investigate equipment and its circuit.` });
    } else if (requested === "off") {
      alerts.push({ id: `${id}-off`, level: "warning", text: `${label} manually switched OFF.` });
    }
  }
  if (state.pumps.pool === "fault") {
    alerts.push({ id: "pool-pipe", level: "critical", text: "Pool water line red: pool pump failed, water flow interrupted." });
  }
  return {
    powerMode, maximumBackupKw: BACKUP_CAPACITY_KW, activeLoadKw, netGridKw, dgOutputKw,
    dgReserveKw, solarOutputKw, backupUtilizationPercent, circuits, effective, alerts,
  };
}
