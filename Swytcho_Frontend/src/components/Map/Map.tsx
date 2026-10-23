import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './Map.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 20.2961,
  lng: 85.8245,
};

const buildings = [
  {
    id: 1,
    name: 'Society Building A',
    position: { lat: 20.2961, lng: 85.8245 },
    type: 'Residential',
    status: 'Online',
  },
  {
    id: 2,
    name: 'Society Building B',
    position: { lat: 20.298, lng: 85.827 },
    type: 'Commercial',
    status: 'Warning',
  },
];

export default function EnergyMap() {
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'swytcho-google-map',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  if (loadError) {
    return <div className="map-message">Unable to load Google Maps.</div>;
  }

  if (!isLoaded) {
    return <div className="map-message">Loading map...</div>;
  }

  return (
    <section className="map">
      <div className="map-heading">
        <div>
          <h2>Society Map</h2>
          <p>Monitor buildings and energy connectivity</p>
        </div>

        <span className="map-live">
          <span className="map-live-dot" />
          Map Online
        </span>
      </div>

      <div className="map-content">
        <div className="map-canvas">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={16}
            options={{
              mapTypeId: 'satellite',
              tilt: 45,
              heading: 0,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              clickableIcons: false,
            }}
          >
            {buildings.map((building) => (
              <Marker
                key={building.id}
                position={building.position}
                title={building.name}
                onClick={() => setSelectedBuilding(building)}
              />
            ))}
          </GoogleMap>
        </div>

        <aside className="map-panel">
          <span className="map-panel-label">SELECTED BUILDING</span>

          <h3>{selectedBuilding.name}</h3>
          <p>{selectedBuilding.type}</p>

          <div className="map-status">
            <span
              className={
                selectedBuilding.status === 'Online'
                  ? 'map-status-dot online'
                  : 'map-status-dot warning'
              }
            />
            {selectedBuilding.status}
          </div>

          <div className="map-divider" />

          <div className= "map-stat">
            <span>Current consumption</span>
            <strong>-- kW</strong>
          </div>

          <div className="map-stat">
            <span>Today's energy</span>
            <strong>-- kWh</strong>
          </div>

          <div className="map-stat">
            <span>Connected floors</span>
            <strong>--</strong>
          </div>

          <p className="map-note">
            Energy readings will appear when the building is connected to
            your Supabase data.
          </p>
        </aside>
      </div>
    </section>
  );
}