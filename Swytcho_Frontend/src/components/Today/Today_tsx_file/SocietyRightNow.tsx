
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
import type { DemoKPI} from "../../../hooks/useDemoData";

interface Props {
  kpis: DemoKPI[];
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <article className="today-metric">
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-detail">{detail}</div>
    </article>
  );
}

export default function SocietyRightNow({ kpis }: Props) {
  const getKpi = (metric: string) =>
    kpis.find((item) => item.metric === metric);

  const format = (metric: string, digits = 2) => {
    const value = getKpi(metric)?.latest_value;

    return value == null ? "—" : value.toFixed(digits);
  };

  const cards = [
    {
      label: "Active power",
      value: `${format("active_power_kw")} kW`,
      detail: "Latest recorded reading",
      icon: <Zap size={19} />,
    },
    {
      label: "Voltage",
      value: `${format("voltage_rms_v", 1)} V`,
      detail: "RMS voltage",
      icon: <Gauge size={19} />,
    },
    {
      label: "Current",
      value: `${format("current_rms_a", 2)} A`,
      detail: "RMS current",
      icon: <Radio size={19} />,
    },
    {
      label: "Power factor",
      value: format("power_factor", 3),
      detail: "Latest recorded reading",
      icon: <Activity size={19} />,
    },
    {
      label: "Frequency",
      value: `${format("frequency_hz", 2)} Hz`,
      detail: "Electrical frequency",
      icon: <Waves size={19} />,
    },
    {
      label: "Enclosure temperature",
      value: `${format("enclosure_temperature_c", 1)} °C`,
      detail: "Equipment temperature",
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
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}
