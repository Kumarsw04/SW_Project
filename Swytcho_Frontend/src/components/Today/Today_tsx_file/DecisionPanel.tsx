
import {
  AlertTriangle,
  Fuel,
  Radio,
  TrendingUp,
} from "lucide-react";
import "../Today_css_file/DecisionPanel.css";

const decisions = [
  {
    id: "meters",
    title: "6 meters are not reporting",
    description: "Check communication status and last-seen times.",
    priority: "High",
    icon: Radio,
    severity: "amber",
  },
  {
    id: "generator",
    title: "Review generator fuel reserve",
    description: "Confirm available fuel against outage requirements.",
    priority: "Review",
    icon: Fuel,
    severity: "amber",
  },
  {
    id: "consumption",
    title: "Investigate unusual consumption",
    description: "Review flats or circuits above normal usage.",
    priority: "Review",
    icon: TrendingUp,
    severity: "blue",
  },
];

export default function DecisionPanel() {
  return (
    <section className="today-panel decision-panel">
      <div className="panel-heading">
        <div className="panel-title">
          <span className="panel-icon">
            <AlertTriangle size={18} />
          </span>
          <h2>Needs Your Decision</h2>
        </div>

        <span className="subtle-count">
          {decisions.length} items
        </span>
      </div>

      <div className="decision-list">
        {decisions.map((decision) => {
          const Icon = decision.icon;

          return (
            <div className="decision-item" key={decision.id}>
              <span
                className={`decision-symbol ${decision.severity}`}
              >
                <Icon size={17} />
              </span>

              <div className="decision-content">
                <strong>{decision.title}</strong>
                <p>{decision.description}</p>
              </div>

              <span
                className={`priority-tag ${
                  decision.priority === "High" ? "priority-high" : ""
                }`}
              >
                {decision.priority}
              </span>
            </div>
          );
        })}
      </div>

      <p className="chart-footnote">
        Sample recommendations for the demo. No real incidents are being
        monitored.
      </p>
    </section>
  );
}
