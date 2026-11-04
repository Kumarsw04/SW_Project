
import { useState } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";

import Today from "./components/Today/Today_tsx_file/Today";
import VoltageQuality from "./components/VoltageQuality/VoltageQuality_tsx_file/VoltageQuality";
import SocietyMap from "./components/SocietyMap/SocietyMap";

import "./index.css";

export default function App() {
  const [activePath, setActivePath] = useState("/today");

  return (
    <div className="app-layout">
      <Sidebar
        activePath={activePath}
        onNavigate={setActivePath}
        locationName="Bhubaneswar, India"
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
