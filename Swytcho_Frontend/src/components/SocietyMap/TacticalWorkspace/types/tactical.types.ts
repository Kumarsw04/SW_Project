export interface WindowPosition {
  x: number;
  y: number;
}

export interface TacticalWindowData {
  id: string;
  applianceId: string;
  position: WindowPosition;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}