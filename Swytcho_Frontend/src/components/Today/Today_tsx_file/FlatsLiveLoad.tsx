
import { Home, Info } from "lucide-react";
import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/FlatsLiveLoad.css";

export default function FlatsLiveLoad() {
  const { data, loading, error } = useDemoData();

  return (
    <section className="today-panel flats-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <Home size={16} />
            <h2>Flat-Level Energy Usage</h2>
          </div>
          <p className="panel-subtitle">
            Individual flat demand and meter reporting
          </p>
        </div>

        <span className="panel-tag">
          {loading ? "LOADING" : "DATA STATUS"}
        </span>
      </div>

      <div className="flats-table-wrap">
        {loading ? (
          <p>Checking available dataset...</p>
        ) : error ? (
          <p>Could not load dataset: {error}</p>
        ) : (
          <div style={{ padding: "24px 12px", textAlign: "center" }}>
            <Info
              size={28}
              style={{ marginBottom: 12, opacity: 0.7 }}
            />

            <h3>Flat-level readings unavailable</h3>

            <p style={{ marginTop: 8 }}>
              The current dataset contains {data?.record_count ?? 0} electrical
              measurement records, but it does not provide verified flat
              identifiers, tower assignments, or individual flat readings.
            </p>

            <p style={{ marginTop: 12 }}>
              To enable this table, connect a dataset containing flat ID,
              tower, active power, energy consumption, and meter reporting
              status.
            </p>
          </div>
        )}
      </div>

      <p className="demo-disclaimer">
        Individual flat consumption cannot be calculated from the available
        device-level readings.
      </p>
    </section>
  );
}
