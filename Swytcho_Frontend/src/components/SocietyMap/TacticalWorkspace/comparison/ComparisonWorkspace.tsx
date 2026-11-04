import type { ApplianceData } from "../../Building3D/types/building.types";
import ComparisonPanel from "./ComparisonPanel";

export interface ApplianceComparison {
  id: string;
  firstApplianceId: string;
  secondApplianceId: string;
}

interface ComparisonWorkspaceProps {
  comparisons: ApplianceComparison[];
  appliances: ApplianceData[];
  onClose: (comparisonId: string) => void;
}

export default function ComparisonWorkspace({
  comparisons,
  appliances,
  onClose,
}: ComparisonWorkspaceProps) {
  if (comparisons.length === 0) return null;

  return (
    <div className="comparison-workspace">
      {comparisons.map((comparison) => {
        const first = appliances.find(
          (item) => item.id === comparison.firstApplianceId
        );

        const second = appliances.find(
          (item) => item.id === comparison.secondApplianceId
        );

        if (!first || !second) return null;

        return (
          <div
            key={comparison.id}
            data-comparison-anchor={comparison.id}
          >
            <ComparisonPanel
              first={first}
              second={second}
              onClose={() => onClose(comparison.id)}
            />
          </div>
        );
      })}
    </div>
  );
}