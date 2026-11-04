import { useSyncExternalStore } from "react";

import { applianceAnchorStore } from "./applianceAnchorStore";

import type { TacticalWindowData } from "../types/tactical.types";
import type { ApplianceComparison } from "../comparison/ComparisonWorkspace";

interface ConnectionLayerProps {
  windows: TacticalWindowData[];
  comparisons: ApplianceComparison[];
  stageWidth: number;
  stageHeight: number;
}

export default function ConnectionLayer({
  windows,
  comparisons,
  stageWidth,
  stageHeight,
}: ConnectionLayerProps) {
  const anchors = useSyncExternalStore(
    applianceAnchorStore.subscribe,
    applianceAnchorStore.getSnapshot,
    applianceAnchorStore.getSnapshot
  );

  const visibleWindows = windows.filter(
    (window) => !window.minimized && !window.maximized
  );

  const windowByAppliance = new Map(
    visibleWindows.map((window) => [window.applianceId, window])
  );

  const getWindowNode = (window: TacticalWindowData) => ({
    x: window.position.x + 320,
    y: window.position.y + 100,
  });

  return (
    <svg
      className="tactical-connection-layer"
      width={stageWidth}
      height={stageHeight}
      viewBox={`0 0 ${stageWidth} ${stageHeight}`}
    >
      <defs>
        <filter id="connection-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="connection-gradient">
          <stop offset="0%" stopColor="#e8c578" />
          <stop offset="100%" stopColor="#83b5a4" />
        </linearGradient>
      </defs>

      {/* 3D appliance to its floating window */}
      {visibleWindows.map((window) => {
        const anchor = anchors.get(window.applianceId);

        if (!anchor?.visible) return null;

        const node = getWindowNode(window);

        const startX = anchor.x;
        const startY = anchor.y;
        const endX = node.x;
        const endY = node.y;

        const controlX = (startX + endX) / 2;

        const path = `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;

        return (
          <g key={`anchor-${window.id}`}>
            <path
              d={path}
              className="connection-path-glow"
            />

            <path
              d={path}
              className="connection-path"
            />

            <circle
              cx={startX}
              cy={startY}
              r="4"
              className="connection-endpoint"
            />

            <circle
              cx={endX}
              cy={endY}
              r="4"
              className="connection-endpoint"
            />
          </g>
        );
      })}

      {/* Source windows to comparison workspace */}
      {comparisons.map((comparison) => {
        const first = windowByAppliance.get(
          comparison.firstApplianceId
        );

        const second = windowByAppliance.get(
          comparison.secondApplianceId
        );

        if (!first || !second) return null;

        // Comparison workspace is positioned at the bottom-right.
        const targetX = stageWidth - 190;
        const targetY = stageHeight - 65;

        return [first, second].map((window, index) => {
          const start = getWindowNode(window);

          const path = `M ${start.x} ${start.y} Q ${
            (start.x + targetX) / 2
          } ${start.y - 45} ${targetX} ${targetY}`;

          return (
            <g key={`${comparison.id}-${index}`}>
              <path
                d={path}
                className="connection-path-glow"
              />
              <path
                d={path}
                className="connection-path comparison-connection-path"
              />
              <circle
                cx={start.x}
                cy={start.y}
                r="3"
                className="connection-endpoint"
              />
            </g>
          );
        });
      })}
    </svg>
  );
}