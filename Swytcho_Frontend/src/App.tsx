
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
//import Map from './components/Map/Map';
//import Buildings from './components/Buildings/Building3D';
//import Reports from './components/Reports/Reports';
//import InfluxTest from "./components/InfluxTest";
import Today from "./components/Today/Today_tsx_file/Today";
import './index.css';

export default function App() {
  const [activePath, setActivePath] = useState('/today');

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
          {activePath === '/society-map' ? (
            <>


            </>
          ) : activePath === '/flat-details' ? (
            <div>Flat details page goes here.</div>
          ///) : activePath === '/reports' ? (
          ///  <Reports />
          ) : activePath === '/today' ? (
            <Today/>
          ) : (

            <div>Select a dashboard page.</div>
          )}
        </div>
      </main>
    </div>
  );
}