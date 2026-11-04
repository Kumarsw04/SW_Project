
import { Info } from "lucide-react";

import { useVoltageQualityData } from "./VoltageQualityProvider";
import "../VoltageQuality_css_file/VoltageDipsHarmonics.css";

export default function VoltageDipsHarmonics() {
  const { loading, error } = useVoltageQualityData();;

  return (
    <section className="voltage-dips-card">

      <div className="vd-heading">
        <div className="vd-title">
          <span className="vd-dot" />
          <h2>Voltage dips & harmonics</h2>
        </div>

        <button
          type="button"
          className="vd-info"
          title="Voltage dips and harmonic distortion monitoring."
          aria-label="About voltage dips and harmonics"
        >
          <Info size={15} />
        </button>
      </div>

      <p className="vd-description">
        Dips and distortion (fast-follow).
      </p>

      {loading ? (
        <div className="vd-skeleton-list">
          <div className="vd-skeleton-line vd-shimmer" />
          <div className="vd-skeleton-line vd-shimmer" />
          <div className="vd-skeleton-line short vd-shimmer" />
        </div>
      ) : (
        <div className="vd-empty-state">
          {error
            ? "Unable to retrieve voltage quality data."
            : "Voltage dip and harmonic readings are awaiting backend integration."}
        </div>
      )}

      <div className="vd-citation">
        <span>⚑</span>
        <span>THD citation still open (decision 1)</span>
      </div>


    </section>
  );
}
