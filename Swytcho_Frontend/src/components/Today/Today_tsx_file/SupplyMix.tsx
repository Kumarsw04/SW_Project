
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Plug } from "lucide-react";

import { useDemoData } from "../../../hooks/useDemoData";
import "../Today_css_file/SupplyMix.css";

export default function SupplyMix() {
  const { data, loading, error } = useDemoData();

  // Find the latest valid reading independently for both measurements.
  const latestReadings = useMemo(() => {
    const records = [...(data?.records ?? [])]
      .filter((record) => record.measurement_valid !== false)
      .sort(
        (a, b) => Date.parse(b._time) - Date.parse(a._time)
      );

    const activeRecord = records.find(
      (record) =>
        typeof record.active_power_kw === "number" &&
        Number.isFinite(record.active_power_kw)
    );

    const apparentRecord = records.find(
      (record) =>
        typeof record.apparent_power_kva === "number" &&
        Number.isFinite(record.apparent_power_kva)
    );

    return {
      activePower: activeRecord?.active_power_kw,
      apparentPower: apparentRecord?.apparent_power_kva,
      activeTime: activeRecord?._time,
      apparentTime: apparentRecord?._time,
    };
  }, [data]);

  const power = latestReadings.activePower;
  const apparentPower = latestReadings.apparentPower;

  const hasPower =
    typeof power === "number" && Number.isFinite(power);

  const hasApparentPower =
    typeof apparentPower === "number" &&
    Number.isFinite(apparentPower);

  const hasData = hasPower || hasApparentPower;

  // Circular chart represents Total Active Power only.
 const option = useMemo(
    () => ({
      backgroundColor: "transparent",

      tooltip: {
        trigger: "item",
        backgroundColor: "#202528",
        borderColor: "#42494e",
        textStyle: { color: "#f5f5f5" },
        formatter: (params: { seriesName: string }) => {
          if (params.seriesName === "Total Active Power") {
            return `Total Active Power: ${
              hasPower ? `${power.toFixed(3)} kW` : "Unavailable"
            }`;
          }

          return `Total Apparent Power: ${
            hasApparentPower
              ? `${apparentPower.toFixed(3)} kVA`
              : "Unavailable"
          }`;
        },
      },

      legend: { show: false },

      series: [
        ...(hasPower
          ? [
              {
                name: "Total Active Power",
                type: "pie",
                radius: ["76%", "90%"],
                center: ["50%", "50%"],
                silent: false,
                label: { show: false },
                data: [
                  {
                    name: "Total Active Power",
                    value: 1,
                    itemStyle: { color: "#e8c578" },
                  },
                ],
              },
            ]
          : []),

        ...(hasApparentPower
          ? [
              {
                name: "Total Apparent Power",
                type: "pie",
                radius: ["56%", "69%"],
                center: ["50%", "50%"],
                silent: false,
                label: { show: false },
                data: [
                  {
                    name: "Total Apparent Power",
                    value: 1,
                    itemStyle: { color: "#8ca8c8" },
                  },
                ],
              },
            ]
          : []),
      ],
    }),
    [power, apparentPower, hasPower, hasApparentPower]
  );

  console.log("SupplyMix readings:", latestReadings);

  if (loading || (!data && !error)) {
    return (
      <section className="today-panel supply-panel">
        <div className="panel-heading">
          <div className="panel-title">
            <span className="panel-icon">
              <Plug size={18} />
            </span>
            <h2>Electrical Power Overview</h2>
          </div>

          <span className="section-status">Loading</span>
        </div>

        <div className="supply-layout">
          <div className="supply-chart">
            <div className="supply-skeleton supply-skeleton-chart" />
          </div>

          <div className="supply-legend">
            <div className="supply-skeleton supply-skeleton-value" />
            <div className="supply-skeleton supply-skeleton-line" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !hasData) {
    return (
      <section className="today-panel supply-panel">
        <div className="panel-heading">
          <div className="panel-title">
            <span className="panel-icon">
              <Plug size={18} />
            </span>
            <h2>Electrical Power Overview</h2>
          </div>

          <span className="section-status">Data unavailable</span>
        </div>

        <p>{error || "Waiting for electrical readings."}</p>
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
                style={{ height: 230, width: "100%" }}
                notMerge
                lazyUpdate
              />

              <div className="supply-chart-center">
                <strong>
                  {hasPower ? `${power.toFixed(3)} kW` : "—"}
                </strong>
                <span>Total Active Power</span>

                <strong>
                  {hasApparentPower
                      ? `${apparentPower.toFixed(3)} kVA`
                      : "—"}
                </strong>
                <span>Total Apparent Power</span>
              </div>
            </>
          ) : (
            <div className="supply-chart-center">
              <strong>-</strong>
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
              <strong>Total Active Power</strong>
              <span>
                {hasPower ? `${power.toFixed(3)} kW` : "—"}
              </span>
            </div>
          </div>

          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: "#8ca8c8" }}
            />

            <div>
              <strong>Total Apparent Power</strong>
              <span>
                {hasApparentPower
                  ? `${apparentPower.toFixed(3)} kVA`
                  : "—"}
              </span>
            </div>
          </div>

          <p className="supply-note">
            Total active power represents real electrical power consumed.
            Total apparent power represents the combined voltage-current
            power magnitude.
          </p>
        </div>
      </div>
    </section>
  );
}
