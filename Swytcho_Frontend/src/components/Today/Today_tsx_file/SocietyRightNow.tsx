
import type { ReactNode } from "react";
import {
  Activity,
  Gauge,
  Radio,
  Zap,
  Thermometer,
  Waves,
} from "lucide-react";
import "../Today_css_file/SocietyRightNow.css";
import type { DemoKPI } from "../../../hooks/useDemoData";

interface Props {
  kpis: DemoKPI[];
  loading?: boolean;
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  loading,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  loading: boolean;
}) {
  return (
    <article className="today-metric">
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
      </div>

      <div className="metric-value">
        {loading ? ( 
          <span className="metric-skeleton" aria-label="Loading value" />
        ) : (
          value
        )}  
      </div>
      <div className="metric-detail">
        {loading ? ( 
          <span className="metric-skeleton-detail" aria-label="Loading details" />
        ) : (
          detail
        )}
      </div>
    </article>
  );
}

export default function SocietyRightNow({ kpis , loading = false }: Props) {
  const getKpi = (metric: string) =>
    kpis.find((item) => item.metric === metric);

  const format = (metric: string, digits = 2) => {
    const value = getKpi(metric)?.latest_value;
    return value == null ? "—" : value.toFixed(digits);
  };

  const comparison = (metric: string, digits = 2) => {
    const kpi = getKpi(metric);

    if (kpi?.previous_value == null || kpi.latest_value == null) {
      return "Waiting for comparison data";
    }

    const change = kpi.change;
    const percent = kpi.change_percent;

    if (change == null) return "Comparison unavailable";

    const sign = change > 0 ? "+" : "";
    const percentText =
      percent == null ? "" : ` (${sign}${percent.toFixed(1)}%)`;

    return `Previous: ${kpi.previous_value.toFixed(digits)} · Change: ${sign}${change.toFixed(digits)}${percentText}`;
  };

  const cards = [
    {
      label: "Active power",
      value: `${format("active_power_kw")} kW`,
      detail: comparison("active_power_kw"),
      icon: <Zap size={19} />,
    },
    {
      label: "Voltage",
      value: `${format("voltage_rms_v", 1)} V`,
      detail: comparison("voltage_rms_v", 1),
      icon: <Gauge size={19} />,
    },
    {
      label: "Current",
      value: `${format("current_rms_a", 2)} A`,
      detail: comparison("current_rms_a"),
      icon: <Radio size={19} />,
    },
    {
      label: "Power factor",
      value: format("power_factor", 3),
      detail: comparison("power_factor", 3),
      icon: <Activity size={19} />,
    },
    {
      label: "Frequency",
      value: `${format("frequency_hz", 2)} Hz`,
      detail: comparison("frequency_hz"),
      icon: <Waves size={19} />,
    },
    {
      label: "Enclosure temperature",
      value: `${format("enclosure_temperature_c", 1)} °C`,
      detail: comparison("enclosure_temperature_c", 1),
      icon: <Thermometer size={19} />,
    },
  ];

  return (
    <section className="today-section">
      <div className="section-heading">
        <div>
          <h2>Society right now</h2>
          <p>Electrical readings from InfluxDB</p>
        </div>

        <span className="section-status">
          <Activity size={14} />
          InfluxDB connected
        </span>
      </div>

      <div className="today-metrics-grid">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} loading={loading}/>
        ))}
      </div>
    </section>
  );
}
