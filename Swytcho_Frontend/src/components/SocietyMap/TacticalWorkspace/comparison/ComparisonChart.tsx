interface ComparisonChartProps {
  firstName: string;
  secondName: string;
  firstPower: number;
  secondPower: number;
}

export default function ComparisonChart({
  firstName,
  secondName,
  firstPower,
  secondPower,
}: ComparisonChartProps) {
  const maximum = Math.max(firstPower, secondPower, 1);

  return (
    <div className="comparison-chart">
      <div className="comparison-chart-heading">
        <span>Rated power comparison</span>
        <span>Watts (W)</span>
      </div>

      <div className="comparison-chart-row">
        <div className="comparison-chart-label">
          <span>{firstName}</span>
          <strong>{firstPower.toLocaleString()} W</strong>
        </div>

        <div className="comparison-chart-track">
          <div
            className="comparison-chart-bar bar-first"
            style={{ width: `${(firstPower / maximum) * 100}%` }}
          />
        </div>
      </div>

      <div className="comparison-chart-row">
        <div className="comparison-chart-label">
          <span>{secondName}</span>
          <strong>{secondPower.toLocaleString()} W</strong>
        </div>

        <div className="comparison-chart-track">
          <div
            className="comparison-chart-bar bar-second"
            style={{ width: `${(secondPower / maximum) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}