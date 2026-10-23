
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Plug } from "lucide-react";

import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/SupplyMix.css";

export default function SupplyMix() {
  const { data, loading, error } = useDemoData();

  const latest = useMemo(() => {
  const records = [...(data?.records ?? [])]
    .filter(
      (record) =>
        typeof record.active_power_kw === "number" &&
        Number.isFinite(record.active_power_kw)
    )
    .sort(
      (a, b) =>
        new Date(a._time).getTime() - new Date(b._time).getTime()
    );

  return records[records.length - 1];
}, [data]);

  const power = latest?.active_power_kw;

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#202528",
        borderColor: "#42494e",
        textStyle: { color: "#f5f5f5" },
        formatter: "{b}: {c} kW",
      },
      legend: { show: false },
      series: [
        {
          name: "Recorded power",
          type: "pie",
          radius: ["65%", "84%"],
          center: ["50%", "50%"],
          label: { show: false },
          itemStyle: {
            borderColor: "#15191c",
            borderWidth: 4,
          },
          data: [
            {
              name: "Recorded active power",
              value: typeof power === "number" ? power : 0,
              itemStyle: { color: "#e8c578" },
            },
          ],
        },
      ],
    }),
    [power]
  );

  if (loading) {
    return (
      <section className="today-panel supply-panel">
        <p>Loading electrical readings...</p>
      </section>
    );
  }

  if (error || !data || typeof power !== "number") {
    return (
      <section className="today-panel supply-panel">
        <p>Could not load readings: {error ?? "No power reading found."}</p>
      </section>
    );
  }

  return (
    <section className="today-panel supply-panel">
      <div className="panel-heading">
        <div className="panel-title">
          <span className="panel-icon">
            <Plug size={18} />
          </span>
          <h2>Recorded Electrical Power</h2>
        </div>

        <span className="section-status">Historical demo data</span>
      </div>

      <div className="supply-layout">
        <div className="supply-chart">
          <ReactECharts
            option={option}
            style={{ height: 210, width: "100%" }}
            notMerge
            lazyUpdate
          />

          <div className="supply-chart-center">
            <strong>{power.toFixed(3)} kW</strong>
            <span>Active power</span>
          </div>
        </div>

        <div className="supply-legend">
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: "#e8c578" }}
            />
            <div>
              <strong>Recorded active power</strong>
              <span>{power.toFixed(3)} kW</span>
            </div>
          </div>

          <p className="supply-note">
            This reading represents measured active power. Grid and generator
            contributions are not available in the current dataset.
          </p>
        </div>
      </div>
    </section>
  );
}
