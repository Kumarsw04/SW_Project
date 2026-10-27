
import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Activity, Clock3 } from "lucide-react";
import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/SocietyLoadChart.css";

const MAX_POINTS = 60;

export default function SocietyLoadChart() {
  const { data, loading, error } = useDemoData();

  const incomingRecords = useMemo(
    () =>
      [...(data?.records ?? [])]
        .filter(
          (record) =>
            typeof record.active_power_kw === "number" &&
            Number.isFinite(record.active_power_kw)
        )
        .sort(
          (a, b) =>
            Date.parse(a._time) - Date.parse(b._time)
        ),
    [data?.records]
  );

  const [history, setHistory] = useState<typeof incomingRecords>([]);

  useEffect(() => {
    if (incomingRecords.length === 0) return;

    setHistory((previous) => {
      const merged = new Map(
        previous.map((record) => [
          `${record.device_id}|${record.channel_id}|${record.channel_role}|${record._time}`,
          record,
        ])
      );

      incomingRecords.forEach((record) => {
        const key = `${record.device_id}|${record.channel_id}|${record.channel_role}|${record._time}`;
        const oldRecord = merged.get(key);

        merged.set(key, oldRecord ? { ...oldRecord, ...record } : record);
      });

      return [...merged.values()]
        .sort(
          (a, b) => Date.parse(a._time) - Date.parse(b._time)
        )
        .slice(-MAX_POINTS);
    });
  }, [incomingRecords]);

  const latest = history[history.length - 1];

  const labels = history.map((record) =>
    new Date(record._time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );

  const activePowerValues = history.map((record) =>
    typeof record.active_power_kw === "number"
      ? record.active_power_kw
      : null
  );

  const apparentPowerValues = history.map((record) =>
    typeof record.apparent_power_kva === "number"
      ? record.apparent_power_kva
      : null
  );

  const option = {
    backgroundColor: "transparent",
    animation: true,
    tooltip: {
      trigger: "axis",
      backgroundColor: "#20201d",
      borderColor: "#414039",
      textStyle: { color: "#f4f0e5" },
      valueFormatter: (value: number | null, _dataIndex: number) =>
        value == null ? "No reading" : `${value.toFixed(3)}`,
    },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: "#a5a49a", fontSize: 11 },
      itemWidth: 14,
      itemHeight: 8,
    },
    grid: {
      top: 38,
      right: 12,
      bottom: 35,
      left: 12,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#393932" } },
      axisTick: { show: false },
      axisLabel: {
        color: "#88877d",
        fontSize: 10,
        hideOverlap: true,
      },
    },
    yAxis: {
      type: "value",
      show: false,
      min: 0,
    },
    series: [
      {
        name: "Active Power (kW)",
        type: "line",
        smooth: true,
        connectNulls: false,
        data: activePowerValues,
        symbol: "circle",
        symbolSize: 4,
        lineStyle: { width: 2.5, color: "#e8c578" },
        itemStyle: { color: "#e8c578" },
        areaStyle: { color: "rgba(232,197,120,0.08)" },
      },
      {
        name: "Apparent Power (kVA)",
        type: "line",
        smooth: true,
        connectNulls: false,
        data: apparentPowerValues,
        symbol: "circle",
        symbolSize: 4,
        lineStyle: { width: 2, color: "#73b9d1" },
        itemStyle: { color: "#73b9d1" },
      },
    ],
  };

  if (error && history.length === 0) {
    return (
      <section className="today-panel load-panel">
        <div className="panel-heading">
          <div className="panel-title">
            <Activity size={16} />
            <h2>Electrical load history</h2>
          </div>
        </div>
        <div className="load-summary">
          <div>
            <span className="metric-label">Latest active power</span>
            <strong>—</strong>
          </div>
        </div>
        <p>Could not load electrical readings: {error}</p>
      </section>
    );
  }

  if (history.length === 0) {
    return (
      <section className="today-panel load-panel">
        <div className="panel-heading">
          <div className="panel-title">
            <Activity size={16} />
            <h2>Electrical load history</h2>
          </div>
        </div>
        <div className="load-summary">
          <div>
            <span className="metric-label">Latest active power</span>
            <strong>—</strong>
          </div>
        </div>
        <div
          className="load-skeleton load-skeleton-chart"
          role="status"
          aria-label="Loading electrical load history"
        />
        <div className="chart-subtitle">
          <Clock3 size={13} />
          <span>
            {loading
              ? "Loading electrical readings..."
              : "Waiting for the first electrical reading..."}
          </span>
        </div>
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
            Live electrical readings updated every 5 seconds
          </p>
        </div>
      </div>

      <div className="load-summary">
        <div>
          <span className="metric-label">Latest active power</span>
          <strong>
            {typeof latest?.active_power_kw === "number"
              ? `${latest.active_power_kw.toFixed(3)} kW`
              : "—"}
          </strong>
        </div>
        <div>
          <span className="metric-label">Latest apparent power</span>
          <strong>
            {typeof latest?.apparent_power_kva === "number"
              ? `${latest.apparent_power_kva.toFixed(3)} kVA`
              : "—"}
          </strong>
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 270, width: "100%" }}
        notMerge
        lazyUpdate
      />

      <div className="chart-subtitle">
        <Clock3 size={13} />
        <span>
          Last {history.length} readings · Active power (kW) and apparent power (kVA)
        </span>
      </div>
    </section>
  );
}
