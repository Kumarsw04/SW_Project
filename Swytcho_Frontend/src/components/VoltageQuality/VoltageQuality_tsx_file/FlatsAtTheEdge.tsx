
import { useMemo } from "react";
import { Info } from "lucide-react";

import { useVoltageQualityData } from "./VoltageQualityProvider";
import "../VoltageQuality_css_file/FlatsAtTheEdge.css";

const MIN_VOLTAGE = 207;
const MAX_VOLTAGE = 253;
const EDGE_MARGIN = 5;

export default function FlatsAtTheEdge() {
  const { data, loading, error } = useVoltageQualityData();

  const edgeFlats = useMemo(() => {
    const latest = new Map<
      string,
      { voltage: number; time: number }
    >();

    (data?.records ?? []).forEach((record) => {
      const value = record.voltage_rms_v;

      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) return;

      const device = record.device_id ?? "Unknown device";
      const time = Date.parse(record._time);

      if (!Number.isFinite(time)) return;

      const previous = latest.get(device);

      if (!previous || time > previous.time) {
        latest.set(device, { voltage: value, time });
      }
    });

    return Array.from(latest.entries())
      .map(([device, reading]) => ({
        device,
        voltage: reading.voltage,
        edge:
          reading.voltage < MIN_VOLTAGE
            ? "Low side"
            : reading.voltage > MAX_VOLTAGE
              ? "High side"
              : reading.voltage <= MIN_VOLTAGE + EDGE_MARGIN
                ? "Low side"
                : reading.voltage >= MAX_VOLTAGE - EDGE_MARGIN
                  ? "High side"
                  : null,
      }))
      .filter((item) => item.edge !== null)
      .sort((a, b) =>
        Math.min(
          Math.abs(a.voltage - MIN_VOLTAGE),
          Math.abs(a.voltage - MAX_VOLTAGE)
        ) -
        Math.min(
          Math.abs(b.voltage - MIN_VOLTAGE),
          Math.abs(b.voltage - MAX_VOLTAGE)
        )
      );
  }, [data]);

  return (
    <section className="flats-edge-card">

      <div className="flats-edge-heading">
        <div className="flats-edge-title">
          <span className="flats-edge-dot" />
          <h2>Flats at the edge</h2>
        </div>

        <button
          type="button"
          className="flats-edge-info"
          title="Latest readings within 5 V of either safe-band limit, or outside the band."
          aria-label="About flats at the edge"
        >
          <Info size={15} />
        </button>
      </div>

      <p className="flats-edge-description">
        Flats closest to the band limits.
      </p>

      {loading ? (
        <div className="flats-edge-list">
          {[1, 2, 3, 4].map((item) => (
            <div className="flats-edge-skeleton" key={item}>
              <div className="flats-edge-skeleton-line flats-shimmer" />
            </div>
          ))}
        </div>
      ) : edgeFlats.length > 0 ? (
        <div className="flats-edge-list">
          {edgeFlats.slice(0, 5).map((flat) => (
            <div className="flats-edge-item" key={flat.device}>
              <span className="flats-edge-bullet">●</span>

              <div className="flats-edge-item-content">
                <span>
                  {flat.device} · {flat.voltage.toFixed(1)} V · {flat.edge}
                </span>

                <div className="flats-edge-indicator">
                  <div
                    style={{
                      width: `${
                        Math.max(
                          0,
                          Math.min(
                            100,
                            (flat.voltage / MAX_VOLTAGE) * 100
                          )
                        )
                      }%`,
                    }}
                  />
                </div>
              </div>

              <span className="flats-edge-unit">V</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flats-edge-empty">
          {error || "No readings close to the voltage limits."}
        </div>
      )}


    </section>
  );
}
