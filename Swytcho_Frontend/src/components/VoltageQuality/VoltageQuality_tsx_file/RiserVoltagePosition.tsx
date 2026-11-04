
import { useMemo } from "react";
import { Info } from "lucide-react";

import { useVoltageQualityData } from "./VoltageQualityProvider";
import "../VoltageQuality_css_file/RiserVoltagePosition.css";

const MIN_VOLTAGE = 207;
const MAX_VOLTAGE = 253;

export default function RiserVoltagePosition() {
  const { data, loading, error } = useVoltageQualityData();

  // Get the latest valid voltage reading for each channel
  const risers = useMemo(() => {
    const latestByChannel = new Map<
      string,
      { voltage: number; time: number }
    >();

    (data?.records ?? []).forEach((record) => {
      if (
        typeof record.voltage_rms_v !== "number" ||
        !Number.isFinite(record.voltage_rms_v)
      ) {
        return;
      }

      const channel = record.channel_id ?? "Unassigned channel";
      const timestamp = Date.parse(record._time);

      if (!Number.isFinite(timestamp)) return;

      const existing = latestByChannel.get(channel);

      if (!existing || timestamp > existing.time) {
        latestByChannel.set(channel, {
          voltage: record.voltage_rms_v,
          time: timestamp,
        });
      }
    });

    return Array.from(latestByChannel.entries())
      .map(([channel, reading]) => ({
        channel,
        voltage: reading.voltage,
        time: reading.time,
        position: Math.max(
          0,
          Math.min(
            100,
            ((reading.voltage - MIN_VOLTAGE) /
              (MAX_VOLTAGE - MIN_VOLTAGE)) *
              100
          )
        ),
        inSafeBand:
          reading.voltage >= MIN_VOLTAGE &&
          reading.voltage <= MAX_VOLTAGE,
      }))
      .sort((a, b) => a.channel.localeCompare(b.channel));
  }, [data]);

  return (
    <section className="riser-position-card">

      {/* Heading */}
      <div className="riser-position-heading">
        <div className="riser-position-title">
          <span className="riser-position-dot" />
          <h2>Where each riser sits now</h2>
        </div>

        <button
          type="button"
          className="riser-position-info"
          title="Shows the latest voltage reading for each available channel against the 207–253 V safe band."
          aria-label="About riser voltage positions"
        >
          <Info size={15} />
        </button>
      </div>

      <p className="riser-position-description">
        Each riser's position inside the band.
      </p>

      {/* Loading Skeleton */}
      {loading && (
        <div
          className="riser-position-list"
          role="status"
          aria-label="Loading riser readings"
        >
          {[1, 2, 3, 4].map((item) => (
            <div className="riser-skeleton-row" key={item}>
              <div className="riser-skeleton-name riser-shimmer" />
              <div className="riser-skeleton-track riser-shimmer" />
              <div className="riser-skeleton-value riser-shimmer" />
            </div>
          ))}
        </div>
      )}

      {/* Riser Readings */}
      {!loading && risers.length > 0 && (
        <div className="riser-position-list">
          {risers.map((riser) => (
            <div className="riser-position-row" key={riser.channel}>

              <span className="riser-position-name">
                {riser.channel}
              </span>

              <div
                className="riser-voltage-track"
                role="progressbar"
                aria-label={`${riser.channel} voltage position within safe band`}
                aria-valuemin={MIN_VOLTAGE}
                aria-valuemax={MAX_VOLTAGE}
                aria-valuenow={riser.voltage}
              >
                <div
                  className={`riser-voltage-fill ${
                    riser.inSafeBand
                      ? "riser-voltage-safe"
                      : "riser-voltage-warning"
                  }`}
                  style={{
                    width: `${riser.position}%`,
                  }}
                />
              </div>

              <span
                className={`riser-position-value ${
                  riser.inSafeBand
                    ? ""
                    : "riser-value-warning"
                }`}
              >
                {riser.voltage.toFixed(2)} V
              </span>

            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && risers.length === 0 && (
        <div className="riser-position-empty">
          {error
            ? "Unable to retrieve riser voltage readings."
            : "No riser voltage readings are currently available."}
        </div>
      )}

    </section>
  );
}
