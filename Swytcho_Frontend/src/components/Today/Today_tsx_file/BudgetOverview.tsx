
import { Wallet } from "lucide-react";
import "../Today_css_file/BudgetOverview.css";

export default function BudgetOverview() {
  return (
    <section className="today-panel budget-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <Wallet size={16} />
            <h2>Electricity Budget</h2>
          </div>
          <p className="panel-subtitle">
            Spending and budget tracking
          </p>
        </div>

        <span className="panel-tag">UNAVAILABLE</span>
      </div>

      <div className="budget-summary">
        <div>
          <span className="metric-label">Amount spent</span>
          <strong className="budget-total">—</strong>
        </div>

        <div className="budget-target">
          <span className="metric-label">Monthly budget</span>
          <strong>—</strong>
        </div>
      </div>

      <div className="budget-progress">
        <p className="panel-subtitle">
          Verified billing and budget data are not available
          in the current dataset.
        </p>
      </div>

      <div className="budget-chart">
        <p className="panel-subtitle">
          The spending chart will be available when actual
          bills and budget records are connected.
        </p>
      </div>
    </section>
  );
}