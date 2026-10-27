
import { useEffect, useState } from "react";
import {
  fetchInfluxRecords,
  type InfluxRecord,
} from "../lib/influx";

export type DemoRecord = InfluxRecord;

export interface DemoKPI {
  metric: string;
  dashboard_label: string;
  unit: string;
  latest_value: number | null;
  minimum: number | null;
  maximum: number | null;
  average: number | null;
  use: string;
}

export interface DemoData {
  dataset_name: string;
  data_status: string;
  source_measurement: string;
  record_count: number;
  source_field_reading_count: number;
  time_range_utc: {
    start: string;
    end: string;
  };
  kpi_summary: DemoKPI[];
  dashboard_feature_map: string[][];
  records: DemoRecord[];
}

const KPI_CONFIG = [
  { metric: "active_power_kw", dashboard_label: "Active Power", unit: "kW", use: "Current electrical load" },
  { metric: "voltage_rms_v", dashboard_label: "Voltage", unit: "V", use: "RMS voltage" },
  { metric: "current_rms_a", dashboard_label: "Current", unit: "A", use: "RMS current" },
  { metric: "power_factor", dashboard_label: "Power Factor", unit: "", use: "Electrical power factor" },
  { metric: "frequency_hz", dashboard_label: "Frequency", unit: "Hz", use: "Electrical frequency" },
  { metric: "enclosure_temperature_c", dashboard_label: "Temperature", unit: "°C", use: "Device enclosure temperature" },
];

export function useDemoData() {
  const [data, setData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval>;

    async function loadData() {
      try {
        setError(null);

        const records = await fetchInfluxRecords();

        if (cancelled) return;

        if (records.length === 0) {
          throw new Error(
            "InfluxDB returned no matching electrical records."
          );
        }

        const sortedRecords = [...records].sort(
          (a, b) => Date.parse(a._time) - Date.parse(b._time)
        );

        const kpi_summary: DemoKPI[] = KPI_CONFIG.map((config) => {
          const values = sortedRecords
            .map((record) => record[config.metric])
            .filter(
              (value): value is number =>
                typeof value === "number" && Number.isFinite(value)
            );

          const latest = [...sortedRecords]
            .reverse()
            .find(
              (record) => typeof record[config.metric] === "number"
            );

          return {
            ...config,
            latest_value:
              typeof latest?.[config.metric] === "number"
                ? (latest[config.metric] as number)
                : null,
            minimum: values.length ? Math.min(...values) : null,
            maximum: values.length ? Math.max(...values) : null,
            average: values.length
              ? values.reduce((sum, value) => sum + value, 0) /
                values.length
              : null,
          };
        });

        setData({
          dataset_name: "SWYTCHO InfluxDB Live Demo",
          data_status: "live_influxdb_demo",
          source_measurement: "erg_telemetry",
          record_count: records.length,
          source_field_reading_count: records.length,
          time_range_utc: {
            start: sortedRecords[0]._time,
            end: sortedRecords[sortedRecords.length - 1]._time,
          },
          kpi_summary,
          dashboard_feature_map: [],
          records: sortedRecords,
        });
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Unable to load InfluxDB data."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    loadData();

    timer = setInterval(loadData, 5_000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return { data, loading, error };
}
