import { useMemo } from "react";
import { useBuildingSimulationContext } from "../simulation/BuildingSimulationContext";
import { buildActiveAlerts } from "./buildActiveAlerts";

export function useActiveBuildingAlerts() {
  const { systems } = useBuildingSimulationContext();
  return useMemo(() => buildActiveAlerts(systems), [systems]);
}
