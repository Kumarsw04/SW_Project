
import { useVoltageQualityData } from "./VoltageQualityProvider";
import { Info } from "lucide-react";

import "../VoltageQuality_css_file/PowerFactor.css";

export default function PowerFactor() {
  const { data, loading, error } = useVoltageQualityData();

  const powerFactorValues = (data?.records ?? [])
    .map((record) => record.power_factor)
    .filter(
      (value): value is number =>
        typeof value === "number" &&
        Number.isFinite(value)
    );

  const average =
    powerFactorValues.length > 0
      ? powerFactorValues.reduce((sum, value) => sum + value, 0) /
        powerFactorValues.length
      : null;

  return (
    <section className="power-factor-card">

      <div className="power-factor-heading">
        <div className="power-factor-title">
          <span className="power-factor-dot" />
          <h2>Power factor</h2>
        </div>

        <button
          type="button"
          className="power-factor-info"
          title="Power factor and estimated cost of the gap."
          aria-label="About power factor"
        >
          <Info size={15} />
        </button>
      </div>

      <p className="power-factor-description">
        Site power factor and what the gap costs.
      </p>

      <div className="power-factor-grid">

        <div className="power-factor-metric">
          <span>Site average</span>
          <strong>
            {loading
              ? "..."
              : average !== null
                ? average.toFixed(3)
                : "--"}
          </strong>
          <div className="power-factor-line" />
        </div>

        <div className="power-factor-metric">
          <span>Pump board</span>
          <strong>--</strong>
          <div className="power-factor-line" />
        </div>

        <div className="power-factor-metric power-factor-cost">
          <span>Cost of the gap</span>
          <strong>--</strong>
          <div className="power-factor-line" />
        </div>

      </div>

      {!loading && error && (
        <p className="power-factor-empty">
          Unable to retrieve power factor data.
        </p>
      )}


    </section>
  );
}
