
import { useVoltageQualityData } from "./VoltageQualityProvider";
import { Info } from "lucide-react";

import "../VoltageQuality_css_file/VoltageBreaches.css";

export default function VoltageBreaches() {
  const { loading, error } = useVoltageQualityData();

  const columns = [
    "Riser",
    "Low min",
    "High min",
    "Worst",
    "Flats",
    "Likely cause",
  ];

  return (
    <section className="voltage-breaches-card">

      <div className="vb-heading">
        <div className="vb-title">
          <span className="vb-dot" />
          <h2>Flats outside 207–253 V — 30 days</h2>
        </div>

        <button
          type="button"
          className="vb-info"
          title="Voltage breach duration and affected flats over the last 30 days."
          aria-label="About voltage breaches"
        >
          <Info size={15} />
        </button>
      </div>

      <p className="vb-description">
        Minutes outside the band per riser.
      </p>

      <div className="vb-table-wrapper">
        <table className="vb-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  {columns.map((column) => (
                    <td key={column}>
                      <div className="vb-skeleton vb-shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="vb-empty">
                  {error
                    ? "Unable to retrieve voltage breach data."
                    : "Voltage breach summary is awaiting backend integration."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </section>
  );
}
