
import { Zap } from "lucide-react";
import "../Today_css_file/CommonAreas.css";

export default function CommonAreas() {
  return (
    <section className="today-panel common-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <Zap size={16} />
            <h2>Common Areas</h2>
          </div>

          <p className="panel-subtitle">
            Equipment serving the entire society
          </p>
        </div>

        <span className="panel-tag">DATA UNAVAILABLE</span>
      </div>

      <div className="common-area-list">
        <article className="common-area-item">
          <div className="common-area-details">
            <h3>Equipment-level readings</h3>
            <p>
              No verified equipment names, individual power
              readings, or operational statuses are available
              in the current dataset.
            </p>
          </div>
        </article>
      </div>

      <div className="common-area-footer">
        Connect equipment-level data to display actual
        common-area consumption and status.
      </div>
    </section>
  );
}
