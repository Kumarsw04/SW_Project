
import { useMemo } from "react";
import { Info } from "lucide-react";

import { useVoltageQualityData } from "./VoltageQualityProvider";
import "../VoltageQuality_css_file/PhaseVoltageBalance.css";

const MIN_VOLTAGE = 207;
const MAX_VOLTAGE = 253;

export default function PhaseVoltageBalance() {
  const { data, loading, error } = useVoltageQualityData();

  const phases = useMemo(() => {
    const latest = new Map<string, { value: number; time: number }>();

    (data?.records ?? []).forEach((record) => {
      const value = record.voltage_rms_v;
      const phase = record.channel_role?.toLowerCase();

      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        !["r", "y", "b"].includes(phase ?? "")
      ) return;

      const time = Date.parse(record._time);
      if (!Number.isFinite(time)) return;

      const previous = latest.get(phase!);

      if (!previous || time > previous.time) {
        latest.set(phase!, { value, time });
      }
    });

    return ["r", "y", "b"].map((phase) => {
      const reading = latest.get(phase);

      return {
        phase,
        value: reading?.value ?? null,
        position: reading
          ? Math.max(
              0,
              Math.min(
                100,
                ((reading.value - MIN_VOLTAGE) /
                  (MAX_VOLTAGE - MIN_VOLTAGE)) * 100
              )
            )
          : 0,
      };
    });
  }, [data]);

  return (
    <section className="phase-balance-card">
      <div className="phase-heading">
        <div className="phase-title">
          <span className="phase-dot" />
          <h2>Phase voltage balance</h2>
        </div>

        <button
          type="button"
          className="phase-info"
          title="Latest available voltage for each electrical phase."
          aria-label="About phase voltage balance"
        >
          <Info size={15} />
        </button>
      </div>

      <p className="phase-description">
        Voltage per phase and imbalance (current balance is on Wiring).
      </p>

      <div className="phase-list">
        {loading
          ? ["R", "Y", "B"].map((phase) => (
              <div className="phase-row" key={phase}>
                <span>{phase}</span>
                <div className="phase-skeleton phase-shimmer" />
                <span>--</span>
              </div>
            ))
          : phases.map((phase) => (
              <div className="phase-row" key={phase.phase}>
                <span>{phase.phase.toUpperCase()}</span>

                <div className="phase-track">
                  {phase.value !== null && (
                    <div
                      className="phase-fill"
                      style={{ width: `${phase.position}%` }}
                    />
                  )}
                </div>

                <span className="phase-value">
                  {phase.value !== null
                    ? `${phase.value.toFixed(1)} V`
                    : "--"}
                </span>
              </div>
            ))}
      </div>

      {!loading && phases.every((phase) => phase.value === null) && (
        <p className="phase-empty">
          {error || "Phase-specific readings are not available."}
        </p>
      )}
    </section>
  );
}
