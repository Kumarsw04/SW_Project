
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Activity, Clock3 } from "lucide-react";
import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/SocietyLoadChart.css";

export default function SocietyLoadChart() {
  const { data, loading, error } = useDemoData();

  const records = useMemo(
    () =>[...(data?.records ?? [])]
      .filter((record) =>typeof record.active_power_kw === "number" && Number.isFinite(record.active_power_kw))
      .sort((a, b) =>new Date(a._time).getTime() - new Date(b._time).getTime()),
  [data]
);

  const latest = records[records.length - 1];

  const labels = records.map((record) =>
    new Date(record._time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  const values = records.map((record) => record.active_power_kw);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#20201d",
      borderColor: "#414039",
      textStyle: { color: "#f4f0e5" },
      valueFormatter: (value: number) => `${value.toFixed(3)} kW`,
    },
    grid: {
      top: 18,
      right: 12,
      bottom: 28,
      left: 12,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#393932" } },
      axisTick: { show: false },
      axisLabel: { color: "#88877d", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      show: false,
      min: 0,
    },
    series: [
      {
        name: "Active power",
        type: "line",
        smooth: true,
        data: values,
        symbol: "circle",
        symbolSize: 4,
        lineStyle: { width: 2.5, color: "#e8c578" },
        itemStyle: { color: "#e8c578" },
        areaStyle: { color: "rgba(232,197,120,0.10)" },
      },
    ],
  };

  if (loading) {
    return (
      <section className="today-panel load-panel">
        <p>Loading electrical readings...</p>
      </section>
    );
  }

  if (error || !data || records.length === 0) {
    return (
      <section className="today-panel load-panel">
        <p>Could not load electrical readings: {error ?? "No records found."}</p>
      </section>
    );
  }

  return (
    <section className="today-panel load-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <Activity size={16} />
            <h2>Electrical load history</h2>
          </div>
          <p className="panel-subtitle">
            Recorded active power across the available dataset
          </p>
        </div>
      </div>

      <div className="load-summary">
        <div>
          <span className="metric-label">Latest recorded power</span>
          <strong>{latest ? `${latest.active_power_kw!.toFixed(3)} kW` : "—"} </strong>
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 245, width: "100%" }}
        notMerge
        lazyUpdate
      />

      <div className="chart-subtitle">
        <Clock3 size={13} />
        <span>Historical readings · Active power (kW)</span>
      </div>
    </section>
  );
}
