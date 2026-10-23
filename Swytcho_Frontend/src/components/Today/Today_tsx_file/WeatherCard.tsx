
import {
  CloudSun,
  Droplets,
  MapPin,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import "../Today_css_file/WeatherCard.css";

export default function WeatherCard() {
  return (
    <section className="today-panel weather-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <CloudSun size={16} />
            <h2>Bhubaneswar weather today</h2>
          </div>
          <p className="panel-subtitle">
            <MapPin size={12} />
            Bhubaneswar, Odisha
          </p>
        </div>

        <span className="panel-tag">DEMO DATA</span>
      </div>

      <div className="weather-main">
        <div className="weather-condition-icon">
          <Sun size={38} />
        </div>

        <div className="weather-temperature">
          <strong>32°</strong>
          <span>Partly cloudy</span>
        </div>
      </div>

      <div className="weather-metrics">
        <div className="weather-metric">
          <Thermometer size={15} />
          <div>
            <span>Feels like</span>
            <strong>36°C</strong>
          </div>
        </div>

        <div className="weather-metric">
          <Droplets size={15} />
          <div>
            <span>Humidity</span>
            <strong>68%</strong>
          </div>
        </div>

        <div className="weather-metric">
          <Wind size={15} />
          <div>
            <span>Wind</span>
            <strong>12 km/h</strong>
          </div>
        </div>
      </div>

      <div className="weather-energy-note">
        <CloudSun size={15} />
        <span>
          Outdoor temperature can influence cooling demand. Use verified
          weather data before relying on energy forecasts.
        </span>
      </div>

      <p className="demo-disclaimer">
        Illustrative weather values; not current meteorological observations.
      </p>
    </section>
  );
}
