export type FloorId = "ground" | "first" | "second";

export interface FloorData {
  id: FloorId;
  name: string;
  level: number;
  height: number;
}

export interface RoomData {
  id: string;
  name: string;
  position: [number, number];
  size: [number, number];
}

export interface ApplianceData {
  id: string;
  name: string;
  type: string;
  floorId: FloorId;
  room: string;
  position: [number, number, number];
  power: number;
  meterId?: string;
}