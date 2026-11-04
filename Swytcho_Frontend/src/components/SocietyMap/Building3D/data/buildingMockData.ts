import type {
  FloorData,
  RoomData,
  ApplianceData,
  FloorId,
} from "../types/building.types";

// Three demo floors
export const DEMO_FLOORS: FloorData[] = [
  {
    id: "ground",
    name: "Ground Floor",
    level: 0,
    height: 2.4,
  },
  {
    id: "first",
    name: "First Floor",
    level: 1,
    height: 2.4,
  },
  {
    id: "second",
    name: "Second Floor",
    level: 2,
    height: 2.4,
  },
];

// Room positions are relative to the floor center.
// Position format: [x, z]
// Size format: [width, depth]
export const DEMO_ROOMS: RoomData[] = [
  {
    id: "living",
    name: "Living Room",
    position: [-1.5, -1.5],
    size: [3, 3],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    position: [1.5, -1.5],
    size: [3, 3],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    position: [-1.5, 1.5],
    size: [3, 3],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    position: [1.5, 1.25],
    size: [1.5, 2.5],
  },
  {
    id: "utility",
    name: "Utility",
    position: [2.25, 2.625],
    size: [1.5, 0.75],
  },
];
export const createDemoAppliances = (
  floorId: FloorId
): ApplianceData[] => [
  {
    id: `${floorId}-ac-living`,
    name: "Living Room AC",
    type: "Air Conditioner",
    floorId,
    room: "living",
    position: [-2, 0.3, -1],
    power: 1500,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-fan-living`,
    name: "Living Room Fan",
    type: "Ceiling Fan",
    floorId,
    room: "living",
    position: [-1, 0.3, -2],
    power: 75,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-tv`,
    name: "Television",
    type: "Television",
    floorId,
    room: "living",
    position: [-1, 0.3, -1],
    power: 120,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-ac-bedroom`,
    name: "Bedroom AC",
    type: "Air Conditioner",
    floorId,
    room: "bedroom",
    position: [2, 0.3, -1],
    power: 1500,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-fan-bedroom`,
    name: "Bedroom Fan",
    type: "Ceiling Fan",
    floorId,
    room: "bedroom",
    position: [1, 0.3, -2],
    power: 75,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-refrigerator`,
    name: "Refrigerator",
    type: "Refrigerator",
    floorId,
    room: "kitchen",
    position: [-2, 0.3, 1],
    power: 250,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-microwave`,
    name: "Microwave",
    type: "Microwave",
    floorId,
    room: "kitchen",
    position: [-1, 0.3, 1],
    power: 1200,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-induction`,
    name: "Induction Cooktop",
    type: "Induction Cooktop",
    floorId,
    room: "kitchen",
    position: [-1, 0.3, 2],
    power: 1800,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-chimney`,
    name: "Kitchen Chimney",
    type: "Kitchen Chimney",
    floorId,
    room: "kitchen",
    position: [-2, 0.3, 2],
    power: 200,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-geyser`,
    name: "Geyser",
    type: "Geyser",
    floorId,
    room: "bathroom",
    position: [2, 0.3, 2],
    power: 2000,
    meterId: `${floorId}-meter`,
  },
  {
    id: `${floorId}-washing-machine`,
    name: "Washing Machine",
    type: "Washing Machine",
    floorId,
    room: "utility",
    position: [2.5, 0.3, 2.5],
    power: 500,
    meterId: `${floorId}-meter`,
  },
];