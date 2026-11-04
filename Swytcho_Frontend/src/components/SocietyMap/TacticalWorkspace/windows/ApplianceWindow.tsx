import type { ApplianceData } from "../../Building3D/types/building.types";

interface ApplianceWindowProps {
  appliance: ApplianceData;
}

export default function ApplianceWindow({
  appliance,
}: ApplianceWindowProps) {
  return (
    <div className="appliance-window-details">
      <div className="appliance-window-type">
        {appliance.type}
      </div>

      <div className="appliance-window-power">
        <span>Rated Power</span>
        <strong>{appliance.power.toLocaleString()} W</strong>
      </div>

      <div className="appliance-window-grid">
        <div>
          <span>Floor</span>
          <strong>{appliance.floorId}</strong>
        </div>

        <div>
          <span>Room</span>
          <strong>{appliance.room}</strong>
        </div>

        <div>
          <span>Meter ID</span>
          <strong>{appliance.meterId ?? "Not assigned"}</strong>
        </div>

        <div>
          <span>Live Consumption</span>
          <strong>—</strong>
        </div>
      </div>

      <p className="appliance-window-note">
        Demo data · Live telemetry not connected
      </p>
    </div>
  );
}