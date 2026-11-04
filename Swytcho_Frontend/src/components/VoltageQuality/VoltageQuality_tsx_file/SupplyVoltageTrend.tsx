
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Info } from "lucide-react";

import { useVoltageQualityData } from "./VoltageQualityProvider";
import "../VoltageQuality_css_file/SupplyVoltageTrend.css";

const MIN_VOLTAGE = 207;
const MAX_VOLTAGE = 253;

export default function SupplyVoltageTrend() {
  const { data, loading, error } = useVoltageQualityData();

  // =========================================
  // FILTER LAST 24 HOURS OF VOLTAGE READINGS
  // =========================================

  const chartData = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    const records = (data?.records ?? [])
      .filter(
        (
          record
        ): record is typeof record & { voltage_rms_v: number } =>
          typeof record.voltage_rms_v === "number" &&
          Number.isFinite(record.voltage_rms_v) &&
          Date.parse(record._time) >= cutoff
      )
      .sort(
        (a, b) =>
          Date.parse(a._time) - Date.parse(b._time)
      );

    const riserGroups = new Map<
      string,
      Array<[string, number]>
    >();

    records.forEach((record) => {
      const riser = record.channel_id ?? "Unassigned riser";

      if (!riserGroups.has(riser)) {
        riserGroups.set(riser, []);
      }

      riserGroups.get(riser)!.push([
        record._time,
        record.voltage_rms_v,
      ]);
    });

    return Array.from(riserGroups.entries()).map(
      ([riser, readings]) => ({
        name: riser,
        type: "line",
        smooth: true,
        showSymbol: false,
        connectNulls: false,
        data: readings,
        lineStyle: {
          width: 2,
        },
        emphasis: {
          focus: "series",
        },
      })
    );
  }, [data]);

  // =========================================
  // CHART CONFIGURATION
  // =========================================

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",

      color: [
        "#e8c578",
        "#83b5a4",
        "#8ca9d1",
        "#d69a83",
        "#b39bd3",
      ],

      tooltip: {
        trigger: "axis",
        backgroundColor: "#202528",
        borderColor: "#42494e",
        textStyle: {
          color: "#f1f1ef",
        },
        axisPointer: {
          type: "line",
        },
        valueFormatter: (value: number) =>
          `${value.toFixed(2)} V`,
      },

      legend: {
        show: chartData.length > 1,
        top: 0,
        right: 10,
        textStyle: {
          color: "#a2a8ac",
          fontSize: 11,
        },
      },

      grid: {
        top: chartData.length > 1 ? 40 : 20,
        left: 55,
        right: 20,
        bottom: 45,
      },

      xAxis: {
        type: "time",
        axisLabel: {
          color: "#92999e",
          fontSize: 11,
          formatter: "{HH}:{mm}",
        },
        axisLine: {
          lineStyle: {
            color: "#42494e",
          },
        },
        splitLine: {
          show: false,
        },
      },

      yAxis: {
        type: "value",
        name: "Voltage (V)",
        min: 180,
        max: 280,
        nameTextStyle: {
          color: "#92999e",
        },
        axisLabel: {
          color: "#92999e",
        },
        splitLine: {
          lineStyle: {
            color: "#30373b",
            type: "dashed",
          },
        },
      },

      series: chartData.map((series, index) => ({
        ...series,

        markArea:
          index === 0
            ? {
                silent: true,
                itemStyle: {
                  color: "rgba(131, 181, 164, 0.12)",
                },
                label: {
                  show: true,
                  position: "insideTop",
                  color: "#83b5a4",
                  fontSize: 10,
                  formatter: "Safe voltage band",
                },
                data: [
                  [
                    { yAxis: MIN_VOLTAGE },
                    { yAxis: MAX_VOLTAGE },
                  ],
                ],
              }
            : undefined,
      })),
    }),
    [chartData]
  );

  // =========================================
  // RENDER
  // =========================================

  return (
    <section className="supply-voltage-card">

      {/* Section Heading */}
      <div className="svt-heading">
        <div className="svt-title">
          <span className="svt-title-dot" />
          <h2>Supply voltage — last 24 hours</h2>
        </div>

        <button
          type="button"
          className="svt-info-button"
          title="Voltage readings per riser with the acceptable 207–253 V range."
          aria-label="About supply voltage chart"
        >
          <Info size={15} />
        </button>
      </div>

      {/* Description */}
      <p className="svt-description">
        Voltage per riser against the safe band.
      </p>

      {/* Chart Container */}
      <div className="svt-chart-container">

        {/* Actual Chart */}
        {!loading && chartData.length > 0 && (
          <ReactECharts
            option={option}
            style={{
              height: "100%",
              width: "100%",
            }}
            notMerge
            lazyUpdate
          />
        )}

        {/* Skeleton Loading */}
        {loading && (
          <div
            className="svt-skeleton"
            aria-label="Loading voltage chart"
            role="status"
          >
            <div className="svt-skeleton-line svt-skeleton-shimmer" />

            <div className="svt-skeleton-line svt-skeleton-shimmer" />

            <div className="svt-skeleton-line svt-skeleton-shimmer" />

            <div className="svt-skeleton-bottom">
              <div className="svt-skeleton-label svt-skeleton-shimmer" />

              <div className="svt-skeleton-label short svt-skeleton-shimmer" />

              <div className="svt-skeleton-label svt-skeleton-shimmer" />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && chartData.length === 0 && (
          <div className="svt-empty-state">
            {error
              ? "Unable to retrieve voltage readings."
              : "No voltage readings available for the last 24 hours."}
          </div>
        )}

      </div>
    </section>
  );
}
