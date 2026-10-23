
import {
  Activity,
  Info,
  Clock3,
} from "lucide-react";
import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/ActivityFeed.css";

export default function ActivityFeed() {
  const { data, loading, error } = useDemoData();

  const records = [...(data?.records ?? [])].sort(
    (a, b) =>
      new Date(b._time).getTime() - new Date(a._time).getTime()
  );

  return (
    <section className="today-panel activity-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <Activity size={16} />
            <h2>Electrical Reading History</h2>
          </div>
          <p className="panel-subtitle">
            Latest recorded measurements from the demo dataset
          </p>
        </div>

        <span className="panel-tag">
          {loading ? "LOADING" : `${records.length} READINGS`}
        </span>
      </div>

      <div className="activity-list">
        {loading ? (
          <p>Loading electrical readings...</p>
        ) : error ? (
          <p>Could not load readings: {error}</p>
        ) : records.length === 0 ? (
          <p>No electrical readings available.</p>
        ) : (
          records.slice(0, 8).map((record, index) => (
            <article
              className="activity-item"
              key={`${record._time}-${index}`}
            >
              <div className="activity-event-icon severity-info">
                <Info size={16} />
              </div>

              <div className="activity-event-content">
                <div className="activity-event-heading">
                  <h3>Electrical measurement recorded</h3>
                  <span className="severity-label severity-info">
                    Recorded
                  </span>
                </div>

                <p>
                  Active power:{" "}
                  {typeof record.active_power_kw === "number"
                    ? `${record.active_power_kw.toFixed(3)} kW`
                    : "Unavailable"}
                  {" · "}
                  Voltage:{" "}
                  {typeof record.voltage_rms_v === "number"
                    ? `${record.voltage_rms_v.toFixed(1)} V`
                    : "Unavailable"}
                </p>

                <span className="activity-event-time">
                  <Clock3 size={12} />
                  {new Date(record._time).toLocaleString("en-IN")}
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="activity-footer">
        <span className="status-dot status-online" />
        <span>Historical demo readings — not live alerts</span>
      </div>
    </section>
  );
}
