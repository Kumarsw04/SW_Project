
import { Activity } from "lucide-react";
import "../Today_css_file/TowerCommonPlaceholder.css";

export default function TowerCommonPlaceholder() {
  return (
    <section className="today-panel model-panel">
      <div className="panel-heading">
        <div className="panel-title">
          <span className="panel-icon">
            <Activity size={18} />
          </span>
          <h2>Tower & Common Areas — Live</h2>
        </div>
      </div>

      <div
        className="model-placeholder"
        aria-label="Reserved area for the future 3D society model"
      >
        <div className="model-placeholder-inner">
          <div className="model-placeholder-symbol">
            <Activity size={30} />
          </div>

          <span>3D SOCIETY MODEL</span>
          <p>
            Reserved for the future interactive tower and common-area view.
          </p>
        </div>
      </div>
    </section>
  );
}
