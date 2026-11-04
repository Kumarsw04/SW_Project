
import {
  Info,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import "../VoltageQuality_css_file/VoltageQuality.css";

import SupplyVoltageTrend from "./SupplyVoltageTrend";
import RiserVoltagePosition from "./RiserVoltagePosition";
import PhaseVoltageBalance from "./PhaseVoltageBalance";
import FlatsAtTheEdge from "./FlatsAtTheEdge";
import PowerFactor from "./PowerFactor";
import VoltageBreaches from "./VoltageBreaches";
import VoltageDipsHarmonics from "./VoltageDipsHarmonics";
import { VoltageQualityProvider } from "./VoltageQualityProvider";

// =========================================
// PAGE HEADER
// =========================================

function VoltageQualityHeader() {
  return (
    <section className="voltage-quality-header">

      <div className="vqh-top-row">
        <div className="vqh-breadcrumb">
          <span>Bhubaneswar</span>
          <span className="vqh-separator">/</span>
          <span>Monitoring</span>
        </div>

        <div className="vqh-actions">
          <button type="button" className="vqh-action-btn">
            <Info size={16} />
            <span>Explain all</span>
          </button>

          <button type="button" className="vqh-action-btn">
            <Sparkles size={15} />
            <span>Ask about this</span>
          </button>

          <button
            type="button"
            className="vqh-expand-btn"
            aria-label="Expand voltage quality"
            title="Expand"
          >
            <ExternalLink size={15} />
          </button>
        </div>
      </div>

      <div className="vqh-title-row">
        <h1>Voltage quality</h1>
      </div>

      <p className="vqh-description">
        Supply voltage against the 207–253 V band.
      </p>

    </section>
  );
}

// =========================================
// MAIN VOLTAGE QUALITY PAGE
// =========================================


export default function VoltageQuality() {
  return (
    <VoltageQualityProvider>
      <main className="voltage-page">

        {/* Section 1: Header */}
        <VoltageQualityHeader />

        {/* Sections 2 and 3 */}
        <div className="voltage-quality-grid">
          <SupplyVoltageTrend />
          <RiserVoltagePosition />
        </div>

        {/* Sections 4, 5 and 6 */}
        <div className="voltage-quality-three-grid">
          <PhaseVoltageBalance />
          <FlatsAtTheEdge />
          <PowerFactor />
        </div>

        {/* Sections 7 and 8 */}
        <div className="voltage-quality-bottom-grid">
          <VoltageBreaches />
          <VoltageDipsHarmonics />
        </div>

      </main>
    </VoltageQualityProvider>
  );
}
