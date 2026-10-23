
import { Fuel, Gauge, Activity, Info } from "lucide-react";
import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/GeneratorPanel.css";

export default function GeneratorPanel() {
  const { data, loading, error } = useDemoData();

  return (
    <section className="today-panel generator-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <Fuel size={16} />
            <h2>Diesel Generator</h2>
          </div>
          <p className="panel-subtitle">
            Generator telemetry and operating status
          </p>
        </div>

        <span className="status-pill">
          <span className="status-dot" />
          Not connected
        </span>
      </div>

      <div className="generator-stats">
        <div className="generator-stat">
          <span className="metric-label">
            <Gauge size={13} />
            Generator load
          </span>
          <strong>— <small>kW</small></strong>
          <span className="metric-helper">
            Generator-specific reading unavailable
          </span>
        </div>

        <div className="generator-stat">
          <span className="metric-label">
            <Fuel size={13} />
            Fuel remaining
          </span>
          <strong>—</strong>
          <span className="metric-helper">
            Fuel sensor data unavailable
          </span>
        </div>
      </div>

      <div className="generator-chart-heading">
        <span>
          <Activity size={13} />
          Generator load history
        </span>
        <span>kW</span>
      </div>

      <div style={{ padding: "24px 8px", textAlign: "center" }}>
        <Info size={24} style={{ marginBottom: 8, opacity: 0.7 }} />

        <p>
          {loading
            ? "Checking available dataset..."
            : error
              ? `Could not load demo data: ${error}`
              : `The dataset contains ${data?.record_count ?? 0} electrical records, but no verified generator-specific load, capacity, or fuel readings.`}
        </p>
      </div>

      <p className="demo-disclaimer">
        Generator monitoring requires separate generator telemetry.
      </p>
    </section>
  );
}
