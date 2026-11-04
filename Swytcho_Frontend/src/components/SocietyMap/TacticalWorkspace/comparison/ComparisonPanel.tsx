import type { ApplianceData } from "../../Building3D/types/building.types";
import ComparisonChart from "./ComparisonChart";

interface ComparisonPanelProps {
  first: ApplianceData;
  second: ApplianceData;
  onClose: () => void;
}

export default function ComparisonPanel({
  first,
  second,
  onClose,
}: ComparisonPanelProps) {
  const difference = Math.abs(first.power - second.power);

  const percentageDifference =
    Math.max(first.power, second.power) > 0
      ? (difference / Math.max(first.power, second.power)) * 100
      : 0;

  const ratio =
    Math.min(first.power, second.power) > 0
      ? Math.max(first.power, second.power) /
        Math.min(first.power, second.power)
      : null;

  return (
    <section className="comparison-panel">
      <header className="comparison-panel-header">
        <div>
          <span className="comparison-eyebrow">
            TACTICAL ANALYSIS / COMPARISON
          </span>
          <h3>Appliance Comparison</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Close comparison"
        >
          ×
        </button>
      </header>

      <div className="comparison-sources">
        <div>
          <span className="comparison-source-node node-first" />
          <strong>{first.name}</strong>
          <span>{first.power.toLocaleString()} W</span>
        </div>

        <div className="comparison-link">
          <span />
          <span className="comparison-link-line" />
          <span />
        </div>

        <div>
          <span className="comparison-source-node node-second" />
          <strong>{second.name}</strong>
          <span>{second.power.toLocaleString()} W</span>
        </div>
      </div>

      <div className="comparison-metrics">
        <div>
          <span>Absolute difference</span>
          <strong>{difference.toLocaleString()} W</strong>
        </div>

        <div>
          <span>Difference vs higher rating</span>
          <strong>{percentageDifference.toFixed(1)}%</strong>
        </div>

        <div>
          <span>Power ratio</span>
          <strong>
            {ratio === null ? "N/A" : `${ratio.toFixed(2)}×`}
          </strong>
        </div>
      </div>

      <ComparisonChart
        firstName={first.name}
        secondName={second.name}
        firstPower={first.power}
        secondPower={second.power}
      />

      <p className="comparison-disclaimer">
        Comparison is based on rated power, not actual energy consumption.
      </p>
    </section>
  );
}