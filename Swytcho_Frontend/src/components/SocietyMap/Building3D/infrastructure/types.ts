/** Presentational statuses for the 3D model. Simulation logic is added separately. */
export type DeviceStatus = "running" | "off" | "fault";

export type SystemId =
  | "dg"
  | "lift-1"
  | "lift-2"
  | "tank-pump"
  | "pool-pump"
  | "solar"
  | "ev-charger";

export interface BuildingSystemsState {
  gridAvailable: boolean;
  dg: { status: DeviceStatus; fuelPercent: number };
  lifts: [DeviceStatus, DeviceStatus];
  pumps: { tank: DeviceStatus; pool: DeviceStatus };
  solar: DeviceStatus;
  evCharger: DeviceStatus;
}

/** Values for the initial visual demo, not actual equipment measurements. */
export const DEFAULT_BUILDING_STATE: BuildingSystemsState = {
  gridAvailable: true,
  dg: { status: "off", fuelPercent: 100 },
  lifts: ["running", "running"],
  pumps: { tank: "running", pool: "running" },
  solar: "running",
  evCharger: "running",
};

export const STATUS_COLORS: Record<DeviceStatus, string> = {
  running: "#23dc92",
  off: "#f05757",
  fault: "#ff273e",
};

export type Position3 = [number, number, number];
