
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Plug } from "lucide-react";

import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/SupplyMix.css";

export default function SupplyMix() {
  const { data, loading, error } = useDemoData();

  const latest = useMemo(() => {
    const records = [...(data?.records ?? [])]
      .filter((record) => record.measurement_valid !== false)
      .sort(
        (a, b) => Date.parse(a._time) - Date.parse(b._time)
      );

    return records[records.length - 1];
  }, [data]);

  const power = latest?.active_power_kw;
  const apparentPower = latest?.apparent_power_kva;

  const hasPower =
    typeof power === "number" && Number.isFinite(power);

  const hasApparentPower =
    typeof apparentPower === "number" &&
    Number.isFinite(apparentPower);

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
          name: "Active power",
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
              name: "Active power",
              value: hasPower ? power : 0,
              itemStyle: { color: "#e8c578" },
            },
          ],
        },
      ],
    }),
    [power, hasPower]
  );

  const showSkeleton =
    loading ||
    (!data && !error) ||
    (!hasPower && !hasApparentPower && !error);

  if (showSkeleton || error || (!hasPower && !hasApparentPower)) {
    return (
      <section className="today-panel supply-panel">
        <div className="panel-heading">
          <div className="panel-title">
            <span className="panel-icon">
              <Plug size={18} />
            </span>
            <h2>Electrical Power Overview</h2>
          </div>

          <span className="section-status">
            {error ? "Data unavailable" : "Loading"}
          </span>
        </div>

        <div className="supply-layout">
          <div className="supply-chart">
            <div
              className="supply-skeleton supply-skeleton-chart"
              role="status"
              aria-label="Loading electrical power readings"
            />
          </div>

          <div className="supply-legend">
            <div className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: "#e8c578" }}
              />
              <div>
                <div className="supply-skeleton supply-skeleton-value" />
                <div className="supply-skeleton supply-skeleton-line" />
              </div>
            </div>

            <div className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: "#8ca8c8" }}
              />
              <div>
                <div className="supply-skeleton supply-skeleton-value" />
                <div className="supply-skeleton supply-skeleton-line" />
              </div>
            </div>

            <div className="supply-skeleton supply-skeleton-note" />
          </div>
        </div>
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
          <h2>Electrical Power Overview</h2>
        </div>

        <span className="section-status">Live telemetry</span>
      </div>

      <div className="supply-layout">
        <div className="supply-chart">
          {hasPower ? (
            <>
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
            </>
          ) : (
            <div className="supply-chart-center">
              <strong>—</strong>
              <span>Active power unavailable</span>
            </div>
          )}
        </div>

        <div className="supply-legend">
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: "#e8c578" }}
            />
            <div>
              <strong>Active Power</strong>
              <span>{hasPower ? `${power.toFixed(3)} kW` : "—"}</span>
            </div>
          </div>

          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: "#8ca8c8" }}
            />
            <div>
              <strong>Apparent Power</strong>
              <span>
                {hasApparentPower
                  ? `${apparentPower.toFixed(3)} kVA`
                  : "—"}
              </span>
            </div>
          </div>

          <p className="supply-note">
            Active power measures real electrical power consumed.
            Apparent power represents the combined voltage-current
            power magnitude.
          </p>
        </div>
      </div>
    </section>
  );
}
