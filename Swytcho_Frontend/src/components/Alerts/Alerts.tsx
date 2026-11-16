import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Search,
  ShieldCheck,
} from "lucide-react";
import "./Alerts.css";

/** Shape intentionally compatible with the Building3D active-alert generator. */
export type AlertSeverity = "critical" | "warning";

export interface AlertRecord {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  equipment: string;
}

export interface AlertsProps {
  /** Current active Building 1 simulation alerts. */
  alerts?: AlertRecord[];
  /** Optional breadcrumb text, e.g. "Bhubaneswar". */
  locationName?: string;
  buildingName?: string;
}

type AlertFilter = "all" | AlertSeverity;

export default function Alerts({
  alerts = [],
  locationName = "Society",
  buildingName = "Building 1",
}: AlertsProps) {
  const [filter, setFilter] = useState<AlertFilter>("all");
  const [query, setQuery] = useState("");

  const stats = useMemo(
    () => ({
      active: alerts.length,
      critical: alerts.filter((alert) => alert.severity === "critical").length,
      warning: alerts.filter((alert) => alert.severity === "warning").length,
      systems: new Set(alerts.map((alert) => alert.equipment)).size,
    }),
    [alerts]
  );

  const visibleAlerts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return alerts.filter((alert) => {
      if (filter !== "all" && alert.severity !== filter) return false;
      if (!search) return true;
      return [alert.title, alert.message, alert.equipment]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [alerts, filter, query]);

  return (
    <main className="sw-alerts-page">
      <div className="sw-alerts-page__breadcrumb">
        <span>{locationName}</span>
        <span aria-hidden="true">/</span>
        <span>Monitoring</span>
      </div>

      <header className="sw-alerts-page__heading">
        <div>
          <p className="sw-alerts-page__eyebrow">EQUIPMENT MONITORING</p>
          <h1>Alerts</h1>
          <p className="sw-alerts-page__description">
            Track manually switched-off equipment, simulated faults, and power warnings in {buildingName}.
          </p>
        </div>
        <span className={`sw-alerts-page__health ${stats.active ? "sw-alerts-page__health--attention" : ""}`}>
          {stats.active ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
          {stats.active ? `${stats.active} active alert${stats.active === 1 ? "" : "s"}` : "No active alerts"}
        </span>
      </header>

      <section className="sw-alerts-page__summary" aria-label="Alert summary">
        <div className="sw-alerts-page__metric">
          <span className="sw-alerts-page__metric-heading"><Bell size={17} /> Active alerts</span>
          <strong aria-live="polite">{stats.active}</strong>
          <span>Needs attention</span>
        </div>
        <div className="sw-alerts-page__metric sw-alerts-page__metric--critical">
          <span className="sw-alerts-page__metric-heading"><AlertCircle size={17} /> Critical faults</span>
          <strong>{stats.critical}</strong>
          <span>Equipment faults and failures</span>
        </div>
        <div className="sw-alerts-page__metric sw-alerts-page__metric--warning">
          <span className="sw-alerts-page__metric-heading"><AlertTriangle size={17} /> Warnings</span>
          <strong>{stats.warning}</strong>
          <span>Off devices and supply warnings</span>
        </div>
        <div className="sw-alerts-page__metric sw-alerts-page__metric--systems">
          <span className="sw-alerts-page__metric-heading"><ShieldCheck size={17} /> Affected systems</span>
          <strong>{stats.systems}</strong>
          <span>Distinct equipment affected</span>
        </div>
      </section>

      <section className="sw-alerts-page__feed" aria-labelledby="sw-alerts-active-title">
        <div className="sw-alerts-page__feed-header">
          <div>
            <h2 id="sw-alerts-active-title">Active equipment alerts</h2>
            <p>Updates automatically when you switch equipment OFF or simulate faults in Building 1.</p>
          </div>
          <span className="sw-alerts-page__feed-count">{visibleAlerts.length} shown</span>
        </div>

        <div className="sw-alerts-page__toolbar">
          <div className="sw-alerts-page__filters" role="group" aria-label="Filter by severity">
            {(["all", "critical", "warning"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={`sw-alerts-page__filter ${filter === option ? "sw-alerts-page__filter--active" : ""}`}
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
              >
                {option === "all" ? "All" : option === "critical" ? "Critical" : "Warnings"}
              </button>
            ))}
          </div>
          <label className="sw-alerts-page__search">
            <Search size={17} aria-hidden="true" />
            <span className="sw-alerts-page__sr-only">Search alerts</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search equipment or alerts..."
              type="search"
            />
          </label>
        </div>

        <div className="sw-alerts-page__list" aria-live="polite">
          {visibleAlerts.length > 0 ? (
            visibleAlerts.map((alert) => (
              <article key={alert.id} className={`sw-alerts-page__alert sw-alerts-page__alert--${alert.severity}`}>
                <div className="sw-alerts-page__alert-icon" aria-hidden="true">
                  {alert.severity === "critical" ? <AlertCircle size={19} /> : <AlertTriangle size={19} />}
                </div>
                <div className="sw-alerts-page__alert-content">
                  <div className="sw-alerts-page__alert-title-row">
                    <h3>{alert.title}</h3>
                    <span className={`sw-alerts-page__severity sw-alerts-page__severity--${alert.severity}`}>
                      {alert.severity === "critical" ? "Critical" : "Warning"}
                    </span>
                  </div>
                  <p>{alert.message}</p>
                  <span className="sw-alerts-page__equipment">{buildingName} · {alert.equipment}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="sw-alerts-page__empty">
              {stats.active === 0 ? <CheckCircle2 size={32} /> : <Search size={32} />}
              <h3>{stats.active === 0 ? "All clear" : "No matching alerts"}</h3>
              <p>
                {stats.active === 0
                  ? "There are no active simulation alerts. Equipment shutdowns and faults will appear here automatically."
                  : "Try a different search or severity filter."}
              </p>
            </div>
          )}
        </div>
      </section>
      <p className="sw-alerts-page__footnote">
        Digital twin simulation only. This page does not control physical equipment.
      </p>
    </main>
  );
}
