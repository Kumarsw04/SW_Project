
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useDemoData } from "../../../hooks/useDemoData";

type VoltageQualityContextType = ReturnType<typeof useDemoData>;

const VoltageQualityContext =
  createContext<VoltageQualityContextType | null>(null);

export function VoltageQualityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const demoData = useDemoData();

  return (
    <VoltageQualityContext.Provider value={demoData}>
      {children}
    </VoltageQualityContext.Provider>
  );
}

export function useVoltageQualityData() {
  const context = useContext(VoltageQualityContext);

  if (!context) {
    throw new Error(
      "useVoltageQualityData must be used inside VoltageQualityProvider"
    );
  }

  return context;
}
