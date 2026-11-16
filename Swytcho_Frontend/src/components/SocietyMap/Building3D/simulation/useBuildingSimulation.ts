import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_BUILDING_STATE,
  type BuildingSystemsState,
  type DeviceStatus,
  type SystemId,
} from "../infrastructure/types";
import { deriveBuilding } from "./deriveBuilding";

const startingState = (): BuildingSystemsState => ({
  ...DEFAULT_BUILDING_STATE,
  dg: { ...DEFAULT_BUILDING_STATE.dg },
  lifts: [...DEFAULT_BUILDING_STATE.lifts] as [DeviceStatus, DeviceStatus],
  pumps: { ...DEFAULT_BUILDING_STATE.pumps },
});

export function useBuildingSimulation() {
  const [systems, setSystems] = useState<BuildingSystemsState>(startingState);
  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [scheduleLiftFault, setScheduleLiftFault] = useState(false);

  // Automatically start DG after a short, visible blackout.
  useEffect(() => {
    if (systems.gridAvailable || systems.dg.status !== "off" || systems.dg.fuelPercent <= 0) return;
    const timer = window.setTimeout(() => {
      setSystems((previous) => {
        if (previous.gridAvailable || previous.dg.status !== "off" || previous.dg.fuelPercent <= 0) return previous;
        return { ...previous, dg: { ...previous.dg, status: "running" } };
      });
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [systems.gridAvailable, systems.dg.status, systems.dg.fuelPercent]);

  // Accelerated demo: fuel usage scales with active DG load.
  // At full rated load, the simulated tank loses 1% per 5 seconds.
  useEffect(() => {
    if (systems.gridAvailable || systems.dg.status !== "running") return;
    const interval = window.setInterval(() => {
      setSystems((previous) => {
        if (previous.gridAvailable || previous.dg.status !== "running") return previous;
        const current = deriveBuilding(previous);
        const decrease = Math.max(0.1, current.dgOutputKw / current.maximumBackupKw);
        const fuelPercent = Math.max(0, Math.round((previous.dg.fuelPercent - decrease) * 10) / 10);
        return {
          ...previous,
          dg: { status: fuelPercent === 0 ? "off" : "running", fuelPercent },
        };
      });
    }, 5000);
    return () => window.clearInterval(interval);
  }, [systems.gridAvailable, systems.dg.status]);

  // Optional automatic fault test to demonstrate a timed alert and a stopped lift car.
  useEffect(() => {
    if (!scheduleLiftFault) return;
    const timer = window.setTimeout(() => {
      setSystems((previous) => ({ ...previous, lifts: [previous.lifts[0], "fault"] }));
      setScheduleLiftFault(false);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [scheduleLiftFault]);

  const toggleGrid = useCallback(() => {
    setSystems((previous) => ({
      ...previous,
      gridAvailable: !previous.gridAvailable,
      dg: {
        ...previous.dg,
        // Preserve a simulated fault across restoring the grid.
        status: previous.dg.status === "fault" ? "fault" : "off",
      },
    }));
  }, []);

  const setDevice = useCallback((id: SystemId, status: DeviceStatus) => {
    setSystems((previous) => {
      switch (id) {
        case "dg":
          return { ...previous, dg: { ...previous.dg, status: status === "fault" ? "fault" : "off" } };
        case "lift-1":
          return { ...previous, lifts: [status, previous.lifts[1]] };
        case "lift-2":
          return { ...previous, lifts: [previous.lifts[0], status] };
        case "tank-pump":
          return { ...previous, pumps: { ...previous.pumps, tank: status } };
        case "pool-pump":
          return { ...previous, pumps: { ...previous.pumps, pool: status } };
        case "solar":
          return { ...previous, solar: status };
        case "ev-charger":
          return { ...previous, evCharger: status };
      }
    });
    setSelectedSystem(id);
  }, []);

  const refillDG = useCallback(() => {
    setSystems((previous) => ({ ...previous, dg: { ...previous.dg, fuelPercent: 100 } }));
  }, []);
  const useDiesel = useCallback(() => {
    setSystems((previous) => {
      const fuelPercent = Math.max(0, Math.round((previous.dg.fuelPercent - 10) * 10) / 10);
      return {
        ...previous,
        dg: { ...previous.dg, fuelPercent, status: fuelPercent === 0 ? "off" : previous.dg.status },
      };
    });
  }, []);
  const reset = useCallback(() => {
    setSystems(startingState());
    setSelectedSystem(null);
    setScheduleLiftFault(false);
  }, []);

  const snapshot = useMemo(() => deriveBuilding(systems), [systems]);
  return {
    systems, snapshot, selectedSystem, setSelectedSystem,
    showConnections, setShowConnections,
    scheduleLiftFault, setScheduleLiftFault,
    toggleGrid, setDevice, refillDG, useDiesel, reset,
  };
}
