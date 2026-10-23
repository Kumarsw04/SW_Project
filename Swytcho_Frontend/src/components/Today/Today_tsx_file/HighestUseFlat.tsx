
import { Crown, Home, Info } from "lucide-react";
import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/HighestUseFlat.css";

export default function HighestUseFlat() {
  const { data, loading, error } = useDemoData();

  return (
    <section className="today-panel highest-flat-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <Crown size={16} />
            <h2>Highest Use Flat Today</h2>
          </div>
          <p className="panel-subtitle">
            Ranked by individual flat energy consumption
          </p>
        </div>

        <span className="panel-tag">NOT AVAILABLE</span>
      </div>

      <div className="highest-flat-content">
        <div className="highest-flat-icon">
          <Home size={24} />
        </div>

        <div className="highest-flat-details">
          <span className="metric-label">Flat-level data</span>
          <h3>
            {loading
              ? "Loading..."
              : error
                ? "Data unavailable"
                : "No verified flat records"}
          </h3>
          <span className="flat-status">
            Individual consumption not provided
          </span>
        </div>
      </div>

      <div className="highest-flat-comparison">
        <div>
          <span className="metric-label">Dataset records</span>
          <strong>{loading ? "—" : data?.record_count ?? 0}</strong>
        </div>

        <div className="highest-flat-difference">
          <Info size={15} />
          <span>Device-level measurements</span>
        </div>
      </div>

      <div className="highest-flat-note">
        <Info size={14} />
        <span>
          {error
            ? `Could not load demo data: ${error}`
            : "Individual flat IDs and energy consumption are required to rank flats accurately."}
        </span>
      </div>
    </section>
  );
}
