
export interface SocietyMetrics {
  liveDemand: number;
  costToday: number;
  projectedMonth: number;
  metersOnline: number;
  totalMeters: number;
  incidents: number;
  powerLoss: number;
  gridUptime: number;
  generatorLoad: number;
  generatorCapacity: number;
  fuelPercent: number;
  todayEnergy: number;
  dailyAverage: number;
  monthlyEnergy: number;
  budgetSpent: number;
  monthlyBudget: number;
}

export interface FlatReading {
  flat: string;
  tower: string;
  kw: number | null;
  kwh: number;
  online: boolean;
}

export interface SupplySource {
  name: string;
  powerKw: number;
  color: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  severity: "success" | "warning" | "info" | "critical";
}

export interface CommonAreaStatus {
  id: string;
  name: string;
  value: string;
  icon: string;
  status: "online" | "warning" | "offline";
}
