import { createContext, useContext, type ReactNode } from "react";
import { useBuildingSimulation } from "./useBuildingSimulation";

type Simulation = ReturnType<typeof useBuildingSimulation>;
const BuildingSimulationContext = createContext<Simulation | null>(null);

/** Keep this provider above the page/route switch so alert state survives navigation. */
export function BuildingSimulationProvider({ children }: { children: ReactNode }) {
  const simulation = useBuildingSimulation();
  return (
    <BuildingSimulationContext.Provider value={simulation}>
      {children}
    </BuildingSimulationContext.Provider>
  );
}

export function useBuildingSimulationContext(): Simulation {
  const context = useContext(BuildingSimulationContext);
  if (!context) {
    throw new Error("Wrap your application in <BuildingSimulationProvider> before using the viewer or alerts.");
  }
  return context;
}
