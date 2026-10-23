
import { MoonStar, ArrowUpRight, Zap } from "lucide-react";
import "../Today_css_file/TonightSummary.css";

export default function TonightSummary() {
  return (
    <section className="today-panel tonight-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <MoonStar size={16} />
            <h2>Tonight in one line</h2>
          </div>
          <p className="panel-subtitle">
            Evening outlook · 6 PM – 11 PM
          </p>
        </div>
        <span className="panel-tag">OUTLOOK</span>
      </div>

      <div className="tonight-content">
        <div className="tonight-icon">
          <Zap size={20} />
        </div>

        <div className="tonight-message">
          <span className="tonight-status">EXPECTED PEAK</span>
          <h3>Evening demand may rise after 7 PM.</h3>
          <p>
            Based on the demo forecast, monitor peak demand and keep
            generator readiness in mind.
          </p>
        </div>

        <div className="tonight-arrow">
          <ArrowUpRight size={20} />
        </div>
      </div>

      <div className="tonight-footer">
        <span>
          <span className="status-dot status-warning" />
          Forecast requires verification
        </span>
        <span>Illustrative demo</span>
      </div>
    </section>
  );
}
