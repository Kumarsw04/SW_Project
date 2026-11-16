import { useState } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Today from "./components/Today/Today_tsx_file/Today";
import VoltageQuality from "./components/VoltageQuality/VoltageQuality_tsx_file/VoltageQuality";
import SocietyMap from "./components/SocietyMap/SocietyMap";
import Alerts from "./components/Alerts/Alerts";
import Actions from "./components/Actions/Actions";

import { BuildingSimulationProvider } from "./components/SocietyMap/Building3D/simulation/BuildingSimulationContext";
import { useActiveBuildingAlerts } from "./components/SocietyMap/Building3D/alerts/useActiveBuildingAlerts";

import "./index.css";

function DashboardContent() {
  const [activePath, setActivePath] = useState("/today");
  const activeAlerts = useActiveBuildingAlerts();

  return (
    <div className="app-layout">
      <Sidebar
        activePath={activePath}
        onNavigate={setActivePath}
        locationName="Bhubaneswar, India"
        alertCount={activeAlerts.length}
      />

      <main className="app-main" aria-label="Dashboard content">
        <Header />

        <div className="app-content">
          {activePath === "/today" ? (
            <Today />
          ) : activePath === "/voltage-quality" ? (
            <VoltageQuality />
          ) : activePath === "/society-map" ? (
            <SocietyMap />
          ) : activePath === "/alerts" ? (
            <Alerts
              alerts={activeAlerts}
              locationName="Bhubaneswar"
              buildingName="Building 1"
            />
          ) : activePath === "/actions" ? (
            <Actions
              locationName="Bhubaneswar"
              buildingName="Building 1"
              onNavigate={setActivePath}
            />
          ) : activePath === "/flat-details" ? (
            <div>Flat details page goes here.</div>
          ) : (
            <div>Select a dashboard page.</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BuildingSimulationProvider>
      <DashboardContent />
    </BuildingSimulationProvider>
  );
}
