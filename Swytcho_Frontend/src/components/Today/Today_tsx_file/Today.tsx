import { useDemoData } from "../../../hooks/useDemoData";
import SocietyRightNow from "./SocietyRightNow";
import TowerCommonPlaceholder from "./TowerCommonPlaceholder";
import DecisionPanel from "./DecisionPanel";
import SupplyMix from "./SupplyMix";
import BudgetOverview from "./BudgetOverview";
import TonightSummary from "./TonightSummary";
import GeneratorPanel from "./GeneratorPanel";
import SocietyLoadChart from "./SocietyLoadChart";
import ActivityFeed from "./ActivityFeed";
import CommonAreas from "./CommonAreas";
import FlatsLiveLoad from "./FlatsLiveLoad";
import HighestUseFlat from "./HighestUseFlat";
import WeatherCard from "./WeatherCard";


//import { societyMetrics } from "../../../data/todayMockData";
import "../Today_css_file/Today.css";

export default function Today() {
  const { data, loading, error } = useDemoData();

if (loading) {
  return <main className="today-page">Loading demo data...</main>;
}

if (error || !data) {
  return (
    <main className="today-page">
      Could not load demo data: {error ?? "No data found."}
    </main>
  );
}
  return (
    <main className="today-page">
      <header className="today-header">
        <div>
          <div className="today-eyebrow">
            SOCIETY ENERGY MANAGEMENT
          </div>
          <h1>Today</h1>
          <p>Here's what's happening across your society.</p>
        </div>

        <div className="today-header-right">
          <span className="live-indicator">
            <span className="live-dot" />
            Demo mode
          </span>
          <span className="today-date">
            Wednesday · 14 October 2026
          </span>
        </div>
      </header>

      <SocietyRightNow kpis={data.kpi_summary} />

      <div className="today-tower-decision-grid">
        <TowerCommonPlaceholder />
        <DecisionPanel />
      </div>

      <div className="today-supply-budget-grid">
        <SupplyMix />
        <BudgetOverview />
      </div>

      <TonightSummary />

      <div className="today-generator-load-grid">
        <GeneratorPanel />
        <SocietyLoadChart />
      </div>

      <div className="today-activity-grid">
        <ActivityFeed />
        <CommonAreas />
      </div>

      <div className="today-supply-flats-grid">
        <FlatsLiveLoad />
      </div>


      <div className="today-bottom-grid">
        <HighestUseFlat />
        <WeatherCard />
      </div>
    </main>
  );
}
