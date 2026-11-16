# SWYTCHO – Smart Society Energy Management Platform

<p align="center">
  <strong>Smart Energy Monitoring • Society Management • Building Digital Twin</strong>
</p>

<<<<<<< HEAD
=======
[![SWYTCHO Frontend CI](https://github.com/Kumarsw04/SW_Project/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Kumarsw04/SW_Project/actions/workflows/frontend-ci.yml)

>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
<p align="center">
  An integrated platform for monitoring, analyzing, and managing electricity consumption and infrastructure across residential societies and other building environments.
</p>

<<<<<<< HEAD
=======

**Repository:** [Kumarsw04/SW_Project](https://github.com/Kumarsw04/SW_Project)  
**Frontend application:** `Swytcho_Frontend/`  
**Project status:** Active development — interactive web demo and partially validated telemetry

> [!IMPORTANT]
> The digital twin is currently a **software simulation**. Equipment switches, breakdowns, alerts, power readings and generator fuel usage in the demo are not connected to real-world control hardware. Historical InfluxDB telemetry has been retrieved during testing, but continuous live telemetry is not yet fully validated.

## Quick Start — Run the Web Application

**Prerequisites:** Node.js and npm, Git, and a modern browser. Use a Node.js version supported by the installed Vite release.

```bash
git clone https://github.com/Kumarsw04/SW_Project.git
cd SW_Project/Swytcho_Frontend
npm install
npm run dev
```

Open the local address printed by Vite in your terminal (usually `http://localhost:5173`).

### Available npm scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Create an optimized production build
npm run preview  # Preview the production build locally
```

### Before using data-connected modules

- The core 3D simulation can be explored as a frontend demo; telemetry-dependent pages require their appropriate service configuration and accessible data.
- If the Excel-based building demo is used, ensure `swytcho_user_building_assignments.xlsx` exists at the public path expected by the application.
- Configure InfluxDB/Supabase/backend endpoints according to the integration in your checkout. **Never commit access tokens, database passwords, or service-role keys.** In production, route privileged InfluxDB and Supabase operations through authorized server-side code rather than exposing secrets in the browser.
- If a Today or Voltage Quality panel reports missing data, that can indicate absent/incomplete telemetry rather than a frontend startup failure.

### Project navigation

The sidebar includes **Today**, **Society Map**, **Voltage Quality**, **Alerts**, and **Actions**, along with other evolving monitoring, billing, maintenance and administration routes. Not every planned page is implemented end-to-end.

## At a Glance — Current Progress

| Area | Status |
|---|---|
| React/Vite dashboard and page navigation | Developed |
| Code-generated Building 1 & Building 2, 3D viewer, Excel assignment demo | Implemented |
| Building 1 DG, lifts, pumps, solar, EV, lighting and electrical flow simulation | Interactive demo implemented |
| Separate Alerts and Actions pages using shared simulation state | Demo implemented |
| InfluxDB historical measurement retrieval | Tested successfully |
| Reliable continuous live telemetry | Still under investigation |
| Supabase authentication and database-driven assignment | Planned |
| Production-grade physical equipment control | Not implemented |
| GitHub Actions CI build + downloadable release artifact | Workflow prepared; activates after commit to GitHub |
| Automatic deployment to a live hosting service | Not configured (deployment target to be selected) |

## Contents

- [Project overview](#1-project-overview)
- [Technology stack](#3-technology-stack)
- [Quick Start](#quick-start--run-the-web-application)
- [Today dashboard](#4-today--society-energy-dashboard)
- [InfluxDB telemetry](#5-influxdb--live-electrical-telemetry)
- [Supabase database](#6-supabase--database-architecture)
- [Bill Copilot and Floorcraft](#7-bill-copilot--electricity-bill-management)
- [SocietyMap and Building Digital Twin](#10-building-digital-twin--3d-models)
- [Infrastructure](#11-infrastructure-management)
- [Repository layout](#15-current-repository-layout--proposed-organization)
- [CI/CD workflow — GitHub Actions](#cicd-workflow--github-actions)
- [Development status and roadmap](#16-current-development-status)
- [Future vision](#18-future-vision)

>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
---

## 1. Project Overview

**SWYTCHO** is a Smart Society Energy Management Platform designed to bring building infrastructure, electricity consumption, smart-meter telemetry, and energy analytics into a centralized digital environment.

The platform aims to help residential societies and building administrators monitor electricity usage, understand energy distribution, track operational costs, manage electrical infrastructure, and make data-driven decisions.

The system combines a web-based dashboard, backend services, relational data management, time-series telemetry, and interactive 3D building visualization.

The long-term vision is to develop SWYTCHO into a comprehensive **Building Energy Management and Digital Twin Platform** that can support residential societies, hospitals, commercial buildings, hotels, and institutional facilities.

### Core Objectives

- Monitor electricity consumption across societies, buildings, floors, and individual connections.
- Retrieve and visualize real-time electrical telemetry.
- Track energy costs, tariffs, bills, and consumption forecasts.
- Manage smart meters and their relationships with buildings and consumers.
- Provide interactive building and floor-wise visualization.
- Integrate appliances and infrastructure into a digital building representation.
- Support centralized monitoring through a unified dashboard.
- Identify abnormal consumption patterns and potential energy inefficiencies.
- Provide administrators with useful information for operational decisions.

---

<<<<<<< HEAD
# 2. Major Project Modules
=======
## 2. Major Project Modules
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

SWYTCHO is organized around several interconnected modules.

| Module | Primary Purpose |
|---|---|
| Today Dashboard | Society-wide energy overview and operational monitoring |
| Energy Monitoring | Live electrical readings and consumption analysis |
| SocietyMap | Building and society visualization |
| Floorcraft | Floor-plan and 3D building visualization |
<<<<<<< HEAD
| Building Digital Twin | Interactive 3D building representation |
=======
| Building Digital Twin | Interactive 3D building representation and equipment simulation |
| Alerts | Active equipment warnings and shutdown/fault counts in a dedicated page |
| Actions | Manual simulation controls linked to 3D equipment and alerts |
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
| Smart Meter Management | Meter registration, mapping, and monitoring |
| Bill Copilot | Electricity bill management and analysis |
| Appliance Management | Appliance information and energy estimation |
| Infrastructure Management | Electrical, mechanical, and utility infrastructure |
| Database Management | Centralized society and building information |

The modules are being developed progressively and are not all production-ready.

---

<<<<<<< HEAD
# 3. Technology Stack

## Frontend
=======
## 3. Technology Stack

### Frontend
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

| Technology | Purpose |
|---|---|
| React | Component-based frontend development |
| TypeScript | Type safety and maintainable application code |
<<<<<<< HEAD
| Vite / Next.js | Frontend development and application framework, depending on the module |
| Tailwind CSS | Utility-based styling |
| CSS | Component-specific styling |
| TanStack Query | Server-state and API data management |
| Zustand | Client-side state management |
| React Hook Form | Form management |
| Zod | Data validation |
| ECharts | Data visualization and analytics |
| React Flow | Node-based workflows and visual relationships |
| Three.js | 3D rendering |
| React Three Fiber | React-based 3D scene development |
| @react-three/drei | 3D utilities and controls |
| Lucide React | Interface icons |

## Backend and Data

| Technology | Purpose |
|---|---|
| Supabase | Database, authentication, and storage |
| PostgreSQL | Relational database |
| InfluxDB Cloud | Time-series electrical telemetry |
| Railway | Existing backend deployment and API hosting |
| REST APIs | Communication between frontend and backend |
| Flux | InfluxDB query language |

## Development and Collaboration
=======
| Vite | Development server and build tool for the current React frontend |
| Tailwind CSS | Utility-based styling |
| CSS | Component-specific styling |
| TanStack Query | Considered for server-state / API data management in broader modules |
| Zustand | Considered for client-side state management in broader modules |
| React Hook Form | Considered for form management |
| Zod | Considered for data validation |
| ECharts | Data visualization and analytics |
| React Flow | Considered for node-based workflows |
| Three.js | 3D rendering and scene geometry |
| React Three Fiber | React-based 3D scene development |
| @react-three/drei | 3D utilities and controls |
| Lucide React | Interface icons |
| XLSX (`xlsx`) | Loading the demonstration building-assignment workbook |

**Current frontend:** React + TypeScript + Vite. The package currently includes React Three Fiber, Drei, Three.js, ECharts, Tailwind CSS, Lucide React, `xlsx`, and Google Maps integration dependencies. TanStack Query, Zustand, React Hook Form, Zod, React Flow, and Next.js are part of the broader project planning or other module discussions; do not assume they are installed in this particular repository without checking `package.json`.

### Backend and Data

| Technology | Purpose |
|---|---|
| Supabase | Planned/partially designed relational database, authentication, and asset storage |
| PostgreSQL | Planned relational schema via Supabase |
| InfluxDB Cloud | Time-series electrical telemetry |
| Railway | Backend/API hosting in the wider platform architecture |
| REST APIs | Communication between frontend and backend |
| Flux | InfluxDB query language |

### Development and Collaboration
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

| Technology | Purpose |
|---|---|
| Git | Version control |
| GitHub | Source code hosting and collaboration |
| DBeaver | Database development and inspection |
| VS Code | Development environment |
| Docker | Containerization and isolated execution where required |
| npm | Package management |

---

<<<<<<< HEAD
# 4. Today – Society Energy Dashboard
=======
## 4. Today – Society Energy Dashboard
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

The Today module provides a centralized overview of electricity consumption and society-level operational information.

It is designed to give administrators a quick understanding of the current energy situation.

### Dashboard Components

| Component | Description |
|---|---|
| SocietyRightNow | Current society-level electrical readings |
| TowerCommonPlaceholder | Building/tower common-area overview |
| DecisionPanel | Important operational information and decisions |
| SupplyMix | Electricity supply distribution |
| BudgetOverview | Energy budget and expenditure overview |
| TonightSummary | Evening and overnight summary |
| GeneratorPanel | Generator operating information |
| SocietyLoadChart | Society-level electrical load visualization |
| ActivityFeed | Recent activities and events |
| CommonAreas | Common-area consumption overview |
| FlatsLiveLoad | Flat-level electricity load |
| HighestUseFlat | Highest-consuming flat information |
| WeatherCard | Weather information |
| Society Load Monitoring | Historical and current load trends |

### Dashboard Technology

- React and TypeScript
- Component-specific CSS
- TanStack Query
- Zustand
- ECharts
- Lucide React
- InfluxDB Cloud integration

### Demo Dashboard Metrics

The initial frontend demonstration uses sample values for layout and data visualization.

| Metric | Sample Value |
|---|---:|
| Live Demand | 184.6 kW |
| Today's Cost | ₹18,420 |
| Projected Monthly Cost | ₹5,70,000 |
| Connected Meters | 286 / 292 |
| Incidents | 3 |
| Power Loss | 4.8% |
| Grid Uptime | 99.2% |
| Generator Load | 45 / 100 |
| Generator Fuel | 68% |
| Today's Consumption | 1,840 |
| Daily Average | 1,720 |
| Monthly Consumption | 42,600 |
| Monthly Budget | ₹4,82,000 / ₹6,00,000 |
| Grid Supply | 160 kW |
| Generator Supply | 45 kW |

*These are demonstration values and should not be interpreted as actual live society readings.*

---

<<<<<<< HEAD
# 5. InfluxDB – Live Electrical Telemetry

InfluxDB Cloud is used for storing and retrieving time-series electrical measurements.

The frontend integration communicates with the InfluxDB Query API using Flux.
=======
## 5. InfluxDB – Live Electrical Telemetry

InfluxDB Cloud is used for storing and retrieving time-series electrical measurements.

The tested frontend telemetry path uses the InfluxDB Query API with Flux. For secure deployment, privileged query credentials should be kept behind an authenticated backend API.
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

### Current Integration

The implementation includes:

- InfluxDB Cloud API communication.
- Bucket and organization configuration.
- Flux query execution.
- CSV response processing.
- Device identification.
- Channel identification.
- Measurement and field extraction.
- Numeric and Boolean value conversion.
- Mapping telemetry fields to dashboard-compatible properties.
- Latest timestamp extraction.
- Latest electrical reading logs.

### Measurement

The currently tested measurement is:

```text
erg_telemetry
```

### Electrical Parameters

The data model supports fields such as:

| Parameter | Description |
|---|---|
| active_power_kw | Active electrical power |
| apparent_power_kva | Apparent power |
| voltage_rms_v | RMS voltage |
| current_rms_a | RMS current |
| frequency_hz | Electrical frequency |
| power_factor | Power factor |
| reactive_power_kvar | Reactive power |
| import_energy_kwh | Imported energy |
| export_energy_kwh | Exported energy |
| enclosure_temperature_c | Enclosure temperature |
| measurement_valid | Measurement validity |

Additional phase-wise fields are supported:

- `active_power_a_kw`
- `active_power_b_kw`
- `active_power_c_kw`
- `total_active_power_kw`
- `apparent_power_a_kva`
- `apparent_power_b_kva`
- `apparent_power_c_kva`
- `total_apparent_power_kva`

### Testing Progress

The integration has successfully retrieved telemetry and displayed electrical readings in the Today dashboard.

Example readings from a successful test:

| Parameter | Retrieved Value |
|---|---:|
| Active Power | 25.66 kW |
| Voltage | 237.7 V |
| Apparent Power | 28.87 kVA |

### Current Limitation

Historical data retrieval using a 30-day range has worked successfully.

However, the one-hour query has returned no matching electrical records during testing.

The query range, latest available telemetry timestamp, and ingestion frequency still need to be investigated.

Continuous real-time monitoring and reliable online/offline detection remain under development.

---

<<<<<<< HEAD
# 6. Supabase – Database Architecture

Supabase is the central database platform for storing structured society, building, consumer, appliance, meter, and energy-related information.
=======
## 6. Supabase – Database Architecture

Supabase is the **intended central relational data platform** for structured society, building, consumer, appliance, meter, and energy-related information. The schema and access model are still being developed; the current Excel username demo is not backed by Supabase Auth.
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

PostgreSQL is used as the relational database.

### Database Development Approach

The database design focuses on:

- Reducing unnecessary joins.
- Avoiding redundant data.
- Maintaining clear relationships.
- Using appropriate indexes.
- Storing frequently accessed information efficiently.
- Using JSONB where flexible or semi-structured information is appropriate.
- Separating transactional data from time-series telemetry.
- Supporting future multi-society access.

### Database Design Areas

The planned database architecture includes the following domains.

| Domain | Information |
|---|---|
| Society Management | Society registration and details |
| Building Management | Buildings and towers |
| Consumer Management | Consumer accounts and connections |
| Floor Management | Floor information |
| Flat Management | Flat and unit information |
| Meter Management | Smart-meter details |
| Meter Mapping | Connections between meters and consumers |
| Appliance Management | Appliance specifications and variants |
| Tariff Management | Electricity tariff information |
| Billing | Electricity bills and bill fields |
| Meter Readings | Recorded meter readings |
| Forecasting | Consumption and cost forecasts |
| Infrastructure | Building infrastructure information |
| User Management | User access and building assignments |

### Database Naming and Optimization

One database naming decision discussed during development is replacing the earlier `households` terminology with `consumer_acc` for consumer-account-related information.

The database also uses JSONB as an option for flexible data that does not require separate relational records.

However, JSONB should not replace relational tables where data requires independent querying, filtering, relationships, or frequent updates.

### Tariff Master

A tariff master table has been designed with fields including:

- `financial_year`
- `tariff`
- `fixed_charge_rate`
- `energy_rate`
- `fppca_rate`
- `govt_surcharge_rate`
- `tax_percent`
- Power-factor-related fields
- `late_payment_rate`

This table is intended to support electricity bill calculations and tariff-based analysis.

### Supabase Access Management

Database access and employee permissions have also been explored.

The intended direction includes:

- Administrative access.
- Employee read-only access where appropriate.
- Role-based access.
- Supabase authentication.
- Row Level Security (RLS).
- Multi-society data separation.

The final production access policies still need to be implemented and verified.

---

<<<<<<< HEAD
# 7. Bill Copilot – Electricity Bill Management
=======
## 7. Bill Copilot – Electricity Bill Management
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

Bill Copilot is intended to provide a structured system for managing electricity bills, meter readings, tariffs, and consumption analysis.

### Planned Functional Areas

| Section | Functionality |
|---|---|
| C1 – Bills | View electricity bills |
| C2 – Add Bill | Enter new bill information |
| C3 – Details | View detailed bill information |
| C4 – Summary / Appliance | Consumption and appliance-related summary |
| C5 – Forecast | Forecast electricity usage and cost |
| C6 – Meter | Meter information |
| C7 – Manual Entry | Manually enter meter readings |
| C8 – Pay | Payment-related functionality |
| C9 – History | Previous bill records |
| C10 – Timeline | Bill and reading timeline |
| C11 – Tariff Summary | Tariff and charge breakdown |

### Bill Data

The proposed bill data structure includes:

- Consumer number
- Tariff category
- Units consumed
- Bill amount
- Billing period
- Sanctioned load
- Arrears
- Custom bill fields

### Supporting Database Areas

- Bills
- Custom bill fields
- Meter readings
- Discom tariffs
- Forecasts
- Appliance information

The bill-management architecture is designed to connect electricity consumption with the applicable tariff and billing period.

*The full Bill Copilot workflow and payment functionality are not yet confirmed as production-complete.*

---

<<<<<<< HEAD
# 8. SocietyMap – Society and Building Visualization
=======
## 8. SocietyMap – Society and Building Visualization
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

SocietyMap is the building-oriented visualization module.

It is intended to provide a visual representation of registered society buildings and their internal structures.

### Existing Development

The project includes an older demonstration system with components such as:

- BuildingCanvas
- BuildingModel
- Floor
- FloorSelector
- Room
- Appliance
- Floor-selection hooks
- Demo floor and appliance data

The newer code-generated building implementation is being developed separately so that the existing demonstration remains unaffected.

### Future Capabilities

- Multiple building registration.
- Building selection.
- Building-wise navigation.
- Floor-wise visualization.
- Flat-level navigation.
- Room-level navigation.
- Appliance placement.
- Meter placement.
- Building infrastructure mapping.

---

<<<<<<< HEAD
# 9. Floorcraft – Floor Plan and 3D Visualization
=======
## 9. Floorcraft – Floor Plan and 3D Visualization
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

Floorcraft is an important part of the broader building digitalization concept.

The idea is to connect registered building information with interactive floor plans and 3D representations.

### Proposed Capabilities

- Floor-plan-based building visualization.
- Floor-wise structure.
- Flat and room identification.
- Appliance placement based on building information.
- Smart-meter placement.
- Building structure registration.
- Integration with external building and map data sources where suitable.

### Building Data Onboarding

A proposed onboarding approach includes:

1. Manual building data entry.
2. Excel or CSV upload.
3. Floor-plan import.
4. PDF-based building information extraction.
5. CAD or IFC-based import where supported.
6. Review and correction of imported information.
7. Saving verified information into Supabase.

Supabase is intended to remain the central source of truth for registered building information.

The visualization layer will use this structured data to generate the corresponding building and floor representation.

---

<<<<<<< HEAD
# 10. Building Digital Twin – 3D Models

The new Building Digital Twin module is being developed using React Three Fiber and Three.js.

The current implementation focuses on code-generated building geometry and user-specific building assignments.
=======
## 10. Building Digital Twin – 3D Models

The Building Digital Twin module uses React Three Fiber and Three.js for model rendering and visualization.

The current implementation includes code-generated geometry, a user-assignment demo, and interactive building-equipment simulations.
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

### Created 3D Models

| Component | Description | Status |
|---|---|---|
| Building1.tsx | First code-generated building | Created |
| Building2.tsx | Second code-generated building | Created |
| BuildingViewer.tsx | Displays assigned building models | Created |
| BuildingViewer.css | Viewer styling | Created |
| BuildingLoginDemo.tsx | Excel-based assignment demonstration | Created |
| BuildingLoginDemo.css | Login demonstration styling | Created |

Two GLB models were also used as visual references during the development of the code-generated models.

The current renderer uses React components rather than loading those original GLB files at runtime.

<<<<<<< HEAD
=======

### Interactive Building 1 Simulation — Implemented Demo

Building 1 has been extended beyond static rendering into a **state-driven, interactive digital-twin demonstration**. The simulation is local to the frontend; it does **not** switch real electrical equipment or claim to show live hardware states.

| Equipment / feature | Current demo behavior |
|---|---|
| Main grid | Manual power cut and restoration; 3D building lighting responds to supply state |
| Diesel generator (DG) | Simulated automatic backup startup, fuel gauge, falling diesel level and fault/refill controls |
| Electrical distribution (MDB) | Visible distribution board, power-source status, animated connection lines and example circuit kW |
| Two lifts | ON/OFF and fault states, visual indicators, motion when operating, and a timed-fault test |
| Tank-fill pump | Manual ON/OFF/fault operation and visual tank-pipeline status |
| Swimming-pool pump | Manual ON/OFF/fault operation and red connection status during failure |
| Rooftop solar | Enabled/disabled solar generation indication and simulated contribution to building load |
| EV charger | ON/OFF/fault controls and connection state |
| Floor lighting | Distinct illumination under normal grid supply, DG backup and total blackout |
| Simulation status | Equipment markers and connection colors distinguish running, off and fault states |

**Example demo configuration:** a 16 kW generator with a short simulated startup delay and accelerated fuel usage. These values are illustrative, not an engineering sizing study. During DG backup, selected nonessential loads may be shed to demonstrate load prioritization.

### Alerts & Actions — Implemented Demo Pages

Each section is a **separate React component** under `src/components/`, following the existing sidebar/page architecture:

- **Alerts** presents a count and list of active equipment shutdowns/faults. A manually switched-off lift or failed pump can create an active alert; restoring equipment clears its active status.
- **Actions** provides controls for main power, DG, lifts, tank and pool pumps, solar generation and EV charging, including fault scenarios and demo reset.
- **Shared simulation state** connects the Actions page, 3D Building Viewer, Alerts page and sidebar badge. Navigating between pages should not discard the simulated device state while the application remains mounted.
- Automatic equipment restrictions associated with DG backup should be distinguished from user-initiated shutdowns to avoid misleading alert counts.

**Persistence limitation:** current demo state and active alerts are not described as a durable audit history. Refresh persistence, user identity, acknowledgment, history, database storage and production notification workflows remain future work.

### Try a Demo Scenario

1. In **Society Map**, open an assigned Building 1 model (for the Excel demonstration, `user1` or `user3` may be used).
2. Go to **Actions** and switch Lift 1 OFF.
3. Verify that Lift 1 changes in the 3D model and the sidebar **Alerts** count increases.
4. Switch the swimming-pool pump OFF or simulate its fault; observe the pump/connection status and the additional alert.
5. Cut main electricity. Observe the simulated blackout, DG response, backup load priority and fuel indication.
6. Restore the grid and equipment to confirm active alerts update as conditions recover.

These steps are for validating the UI/demo logic, not for commissioning any real infrastructure.

>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
### Excel-Based Building Assignment

The following sample users have been configured:

| Username | Building Assignment |
|---|---|
| user1 | building_1 |
| user2 | building_2 |
| user3 | building_1, building_2 |

The application reads the Excel workbook and filters the assignments according to the entered username.

The resulting building assignments are passed to the BuildingViewer, which conditionally renders the relevant components.

This is currently a demonstration system and not a secure login implementation.

### Future Building Hierarchy

```text
Society
  |
  ├── Building
  |     |
  |     ├── Floor
  |     |     |
  |     |     ├── Flat
  |     |     |     |
  |     |     |     ├── Room
  |     |     |     |     ├── Appliances
  |     |     |     |     └── Smart Meter
  |     |     |
  |     |     └── Common Areas
  |     |
  |     └── Infrastructure
  |
  └── Building
        |
        └── Floors and Infrastructure
```

---

<<<<<<< HEAD
# 11. Infrastructure Management
=======
## 11. Infrastructure Management
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

The long-term Building Digital Twin architecture will include reusable infrastructure components.

Instead of developing separate 3D models for every building, the system is intended to maintain a reusable component library.

### Electrical Infrastructure

- Transformer
- Diesel Generator (DG)
- Main Distribution Panel (MDB)
- Sub Distribution Panel (DB)
- UPS
- Battery Bank
- Solar Inverter

### Water Management

- Water Pumps
- Underground Water Tanks
- Overhead Water Tanks
- Water Treatment Plant (WTP)
- Sewage Treatment Plant (STP)

### Mechanical Infrastructure

- Lifts and Elevators
- HVAC Systems
- Chillers
- Cooling Towers
- Air Compressors

### Fire Safety

- Fire Pumps
- Fire Alarm Systems
- Sprinkler Systems
- Fire Extinguishers

### Security and Common Facilities

- CCTV
- Access Control
- Parking
- Staircases
- Common Area Lighting
- EV Charging Stations

<<<<<<< HEAD
These are planned infrastructure components. The reusable 3D library is not yet complete.
=======
The full production infrastructure catalog is **planned**. The current Building 1 demonstration already includes initial 3D implementations of the DG, MDB, lifts, water pumps, rooftop solar, EV charger and their status/flow connections; the wider reusable library is **not yet complete**.
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

### Reusable Component Concept

A component such as a water pump should be developed once and reused across multiple buildings.

Each installation can have its own:

- Component ID
- Building ID
- Floor or location
- Manufacturer
- Model
- Power rating
- Meter ID
- Operational status
- Maintenance information

The 3D representation remains reusable, while the configuration and telemetry are specific to the installation.

---

<<<<<<< HEAD
# 12. Smart Meter and Appliance Management
=======
## 12. Smart Meter and Appliance Management
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

Smart meters and appliances are intended to connect the physical building representation with actual electrical consumption information.

### Smart Meter Management

Planned capabilities:

- Meter registration.
- Meter-to-building mapping.
- Meter-to-floor mapping.
- Meter-to-flat mapping.
- Meter-to-consumer mapping.
- Device and channel identification.
- Meter communication status.
- Electrical reading visualization.

### Appliance Management

Planned capabilities:

- Appliance catalog.
- Appliance variants.
- Appliance specifications.
- Appliance placement inside rooms.
- Estimated power consumption.
- Appliance-wise energy analysis.
- Connection with flat and room information.

The appliance database design also considers fields such as category, subcategory, capacity, technology, efficiency rating, and power range.

---

<<<<<<< HEAD
# 13. Society Map and Satellite Visualization
=======
## 13. Society Map and Satellite Visualization
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

A future SocietyMap extension will allow users to navigate registered buildings geographically.

### Proposed Capabilities

- Display registered societies on a map.
- Display individual buildings using map markers.
- Select a building from the map.
- Open its 3D representation.
- Navigate between buildings.
- Provide detailed 3D building views to eligible premium users.

The map experience is intended to connect geographical building information with the internal 3D digital twin.

---

<<<<<<< HEAD
# 14. Data and System Architecture
=======
## 14. Data and System Architecture
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

The platform separates structured information, telemetry, backend operations, and visual rendering.

```text
                         SWYTCHO
                            |
              +-------------+-------------+
              |             |             |
           Frontend      Backend        Data
              |             |             |
           React       Railway APIs    Supabase
        TypeScript          |          PostgreSQL
              |             |             |
              +-------------+-------------+
                            |
                 +----------+----------+
                 |                     |
             InfluxDB              Supabase
           Time-series             Storage
             Telemetry              Assets
                 |                     |
                 +----------+----------+
                            |
                      Visualization
                            |
                 +----------+----------+
                 |                     |
              Dashboard          Building Digital
                                     Twin
```

### Responsibilities

| System | Responsibility |
|---|---|
| React Frontend | User interface and application interaction |
| Railway | Existing backend hosting and API/business logic |
| Supabase | Relational data, authentication and storage |
| PostgreSQL | Structured application data |
| InfluxDB Cloud | Electrical time-series telemetry |
| Three.js / React Three Fiber | Interactive 3D visualization |
| GitHub | Source code and collaboration |

The exact division of responsibilities between Railway and Supabase will depend on the final API and security architecture.

---

<<<<<<< HEAD
# 15. Proposed Project Folder Organization
=======
## 15. Current Repository Layout & Proposed Organization

### Current Frontend Structure (selected paths)

The repository currently stores the frontend in a subdirectory, not at its root. Paths below focus on the developed areas; older SocietyMap demo files and additional dashboard modules remain in place.

```text
SW_Project/
├── README.md
├── .github/                                 # Add when enabling CI
│   └── workflows/
│       └── frontend-ci.yml
└── Swytcho_Frontend/
    ├── package.json
    ├── package-lock.json
    ├── public/
    │   └── swytcho_user_building_assignments.xlsx  # Excel demo, if present
    └── src/
        ├── App.tsx
        └── components/
            ├── Header/
            ├── Sidebar/
            │   ├── Sidebar.tsx
            │   └── Sidebar.css
            ├── Today/
            ├── VoltageQuality/
            ├── Alerts/
            │   ├── Alerts.tsx
            │   ├── Alerts.css
            │   └── index.ts
            ├── Actions/
            │   ├── Actions.tsx
            │   ├── Actions.css
            │   └── index.ts
            └── SocietyMap/
                ├── SocietyMap.tsx
                ├── BuildingLoginDemo.tsx
                └── Building3D/
                    ├── BuildingViewer.tsx
                    ├── BuildingViewer.css
                    ├── building_1/
                    │   ├── Building1.tsx
                    │   └── Building1.css
                    ├── building_2/
                    │   └── Building2.tsx
                    ├── infrastructure/
                    └── simulation/
```

The tree is selective, and some helper names/locations vary as features evolve. Consult the source tree for exact filenames.

### Longer-Term Proposed Organization

>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

The following is a target organizational structure for the major SWYTCHO modules. It is not a claim that every listed file or directory has already been created.

```text
SWYTCHO/
│
├── public/
│   ├── models/
│   │   ├── buildings/
│   │   └── infrastructure/
│   │
│   ├── textures/
│   └── swytcho_user_building_assignments.xlsx
│
├── src/
│   │
│   ├── components/
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── Today/
│   │   │   ├── SocietyRightNow/
│   │   │   ├── SupplyMix/
│   │   │   ├── BudgetOverview/
│   │   │   ├── GeneratorPanel/
│   │   │   ├── SocietyLoadChart/
│   │   │   └── ActivityFeed/
│   │   │
│   │   ├── SocietyMap/
│   │   │   ├── BuildingAccess/
│   │   │   ├── Building3D/
│   │   │   ├── Floors/
│   │   │   ├── Flats/
│   │   │   ├── Rooms/
│   │   │   └── Map/
│   │   │
│   │   ├── Floorcraft/
│   │   │   ├── FloorPlan/
│   │   │   ├── FloorVisualization/
│   │   │   └── BuildingEditor/
│   │   │
│   │   ├── BillCopilot/
│   │   │   ├── Bills/
│   │   │   ├── BillDetails/
│   │   │   ├── MeterReadings/
│   │   │   ├── Forecast/
│   │   │   └── TariffSummary/
│   │   │
│   │   ├── Appliances/
│   │   ├── SmartMeters/
│   │   ├── Infrastructure/
│   │   └── EnergyMonitoring/
│   │
│   ├── services/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── influxdb/
│   │   │   └── influx.ts
│   │   │
│   │   └── railway/
│   │       └── api.ts
│   │
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   └── config/
│
├── package.json
├── tsconfig.json
└── README.md
```

Actual source directories may differ by module or repository. This structure is intended as an organizational reference for future development.

---

<<<<<<< HEAD
# 16. Current Development Status
=======
## CI/CD Workflow — GitHub Actions

SWYTCHO uses Git for version control and is hosted in the [`Kumarsw04/SW_Project`](https://github.com/Kumarsw04/SW_Project) repository. The **proposed GitHub Actions workflow** below automatically validates and packages the React/Vite frontend when changes are pushed or reviewed. It does **not** deploy the site to production yet.

### Pipeline overview

```text
Developer pushes to main / opens a pull request
                    |
                    v
            GitHub Actions CI
                    |
      +-------------+-------------+
      |             |             |
  Check out     Set up        npm ci
    source      Node 22      dependencies
      |             |             |
      +-------------+-------------+
                    |
                    v
              npm run build
                    |
                    v
         Upload built dist/ files
                    |
                    v
        Downloadable build artifact
                    |
                    v
    Production deployment (future step)
```

### What is automated?

| Pipeline stage | Action | Result |
|---|---|---|
| Trigger | Push to `main`, pull request targeting `main`, or manual run | CI starts on GitHub |
| Checkout | `actions/checkout` | Retrieves the project code |
| Node.js | `actions/setup-node` (Node 22) | Consistent JavaScript runtime |
| Install | `npm ci` inside `Swytcho_Frontend/` | Reproducible install using `package-lock.json` |
| Build | `npm run build` | Generates the production Vite bundle in `dist/` |
| Delivery artifact | `actions/upload-artifact` | Stores the compiled frontend for download from a workflow run |
| Production deployment | Not yet enabled | Requires selecting a hosting platform and setting up credentials |

**Workflow location (relative to the repository root):** `.github/workflows/frontend-ci.yml` — **not** `Swytcho_Frontend/.github/workflows/`.

### Workflow YAML

Create `.github/workflows/frontend-ci.yml` with the following content:

```yaml
name: SWYTCHO Frontend CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: frontend-ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    name: Build React + Vite frontend
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: Swytcho_Frontend

    steps:
      - name: Check out repository
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: '22'
          cache: npm
          cache-dependency-path: Swytcho_Frontend/package-lock.json

      - name: Install locked dependencies
        run: npm ci

      - name: Build production frontend
        run: npm run build

      - name: Upload frontend build artifact
        uses: actions/upload-artifact@v7
        with:
          name: swytcho-frontend-dist
          path: Swytcho_Frontend/dist/
          if-no-files-found: error
          retention-days: 7
```

The template is also provided as a separate file alongside this README. These are the **actual scripts defined in the current Vite frontend**: `dev`, `build`, and `preview`; no lint or automated test command is assumed. Consequently, a passing workflow validates the frontend bundle build, **not** full end-to-end behavior or live telemetry. Add test and lint stages when those scripts exist.

### Enable CI on the `Kumarsw04/SW_Project` repository

1. Place `README.md` at the **repository root** (`SW_Project/README.md`).
2. Create the repository-root `.github/workflows/` folder and copy `frontend-ci.yml` into it.
3. From the root of the Git repository, run:

   ```bash
   git add README.md .github/workflows/frontend-ci.yml
   git commit -m "ci: add SWYTCHO frontend build workflow and documentation"
   git push origin main
   ```

4. Open [GitHub Actions for SW_Project](https://github.com/Kumarsw04/SW_Project/actions). Select **SWYTCHO Frontend CI** to view the checkout, install, build, and artifact-upload steps.
5. After a successful run, open that run's **Artifacts** section and download `swytcho-frontend-dist` if you want the compiled frontend.

The `package-lock.json` inside `Swytcho_Frontend/` must remain committed because `npm ci` and npm caching depend on it. If the pipeline fails, inspect the **Actions** job logs; a locally working Vite page does not guarantee a clean production build.

### Continuous delivery and deployment plan

The current pipeline delivers a **build artifact** but does **not** change the live website. This avoids accidentally deploying development/demo code or exposing frontend environment variables. Once the team chooses a target such as Railway, Vercel, Netlify, or another approved host, a separate deployment job can be added with:

- A production environment and required approvals.
- Secrets stored in **GitHub Actions secrets** or the hosting platform, never in this repository.
- Deployment only after a successful build on the intended branch.
- Post-deployment smoke checks and a rollback plan.

**Security note:** Frontend environment variables included in a Vite production bundle may become visible to users. Never place InfluxDB write tokens, Supabase service-role keys, or other private credentials in `VITE_*` variables. Use secure backend APIs for privileged operations.

---

## 16. Current Development Status
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

The following table summarizes the development progress based on the work completed and discussed so far.

| Module / Feature | Current Status |
|---|---|
| SWYTCHO Today dashboard UI | Developed |
| Today dashboard mock data | Available |
| Dashboard component structure | Developed |
| InfluxDB Cloud connection | Tested successfully |
| Historical telemetry retrieval | Working |
| One-hour telemetry retrieval | Under investigation |
| Electrical readings on dashboard | Successfully tested |
| Supabase database design | In progress |
| Tariff master table design | Developed |
| Consumer account naming | Discussed |
| JSONB data optimization | Explored |
| Employee read-only access | Explored |
| Bill Copilot data model | Designed / discussed |
| SocietyMap existing demo | Available |
| Building 1 code-generated model | Created |
| Building 2 code-generated model | Created |
| Building Viewer | Created |
| Excel building assignment demo | Working implementation |
| SocietyMap building demo integration | Implemented |
<<<<<<< HEAD
=======
| Interactive power cut and DG backup demo | Implemented in frontend simulation |
| Animated electrical connections and circuit load demo | Implemented; runtime validation ongoing |
| Dedicated Alerts page and active-alert counting | Implemented as frontend demo |
| Dedicated Actions page and shared simulation controls | Implemented as frontend demo |
| Persistent event history / acknowledgment | Planned |
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
| Supabase authentication | Planned |
| Database-driven building assignments | Planned |
| GLB loading through Supabase Storage | Planned |
| Floor-wise new-model navigation | Planned |
| Flat and room visualization | Planned |
| Appliance placement in new 3D system | Planned |
<<<<<<< HEAD
| Reusable infrastructure library | Planned |
=======
| Building 1 demo infrastructure (DG, lifts, pumps, solar, EV, MDB) | Implemented as simulated 3D components |
| Full reusable infrastructure library | Planned / in progress |
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
| Smart meter mapping to 3D models | Planned |
| Live telemetry in 3D buildings | Planned |
| Satellite society navigation | Planned |
| Premium 3D access | Planned |
<<<<<<< HEAD

---

# 17. Development Roadmap
=======
| GitHub Actions automated frontend build | Workflow provided for installation; GitHub run not yet verified |
| Production CI/CD deployment | Planned after hosting/service configuration |

---

## 17. Development Roadmap
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

The following roadmap represents the proposed order of development.

### Phase 1 – Core Dashboard and Data

- Complete Today dashboard integration.
- Validate InfluxDB telemetry.
- Resolve the one-hour query issue.
- Establish reliable latest-reading retrieval.
- Complete the required Supabase database structures.

### Phase 2 – Society and Building Data

- Establish society and building registration.
- Define building, floor, flat, and room relationships.
- Implement consumer and meter mapping.
- Integrate Supabase authentication.
- Replace Excel-based assignments with database-driven access.

### Phase 3 – Building Digital Twin

<<<<<<< HEAD
- Complete the building renderer.
- Support code-generated and GLB models.
=======
- Continue refining the **existing code-generated Building 1 and Building 2 viewer** and interactive simulation.
- Add GLB model loading (the current viewer does not dynamically load GLB assets).
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
- Develop floor-wise navigation.
- Develop flat and room visualization.
- Introduce reusable 3D components.

### Phase 4 – Infrastructure and Appliances

<<<<<<< HEAD
- Build the infrastructure component library.
=======
- Extend the **initial implemented 3D component set** into a reusable, configurable infrastructure library.
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
- Implement appliance placement.
- Add water, electrical, mechanical, and safety systems.
- Connect infrastructure components to their database records.
- Map smart meters to physical locations.

### Phase 5 – Live Energy Visualization

- Integrate InfluxDB data into the 3D environment.
- Display building-wise and floor-wise consumption.
- Visualize meter status.
- Show generator and grid supply.
<<<<<<< HEAD
- Introduce abnormal-consumption alerts.
=======
- Extend existing simulated equipment alerts to verified real telemetry alerts.
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
- Add historical consumption visualization.

### Phase 6 – Advanced Building Platform

- Develop satellite-based society navigation.
- Integrate building data onboarding.
- Support multiple building categories.
- Introduce premium 3D access.
- Improve performance and deployment.
- Expand the platform to hospitals, hotels, commercial buildings, and institutional environments.

---

<<<<<<< HEAD
# 18. Future Vision
=======
## 18. Future Vision
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

SWYTCHO is intended to evolve beyond a conventional electricity dashboard.

The long-term goal is to create a connected digital environment where the physical and digital representations of a society or building work together.

A registered building should eventually have:

- A geographical location.
- A 3D building representation.
- Floor-wise and flat-wise structure.
- Appliance information.
- Smart-meter mapping.
- Electrical distribution infrastructure.
- Water and mechanical infrastructure.
- Live energy readings.
- Historical consumption data.
- Operational status and maintenance information.

The same architecture should be reusable across different building environments.

### Target Building Categories

| Building Type | Potential Applications |
|---|---|
| Residential Societies | Energy monitoring, flat-wise consumption, common utilities |
| Hospitals | Critical power, UPS, HVAC, medical utility monitoring |
| Commercial Buildings | Centralized energy and infrastructure management |
| Hotels | Room-wise and common-area energy monitoring |
| Educational Institutions | Building-wise energy monitoring |
| Industrial / Institutional Facilities | Electrical infrastructure and utility monitoring |

---

<<<<<<< HEAD
# 19. Project Objective
=======
## 19. Project Objective
>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)

**SWYTCHO aims to connect energy data, building infrastructure, and digital visualization into one intelligent management platform.**

By combining structured building information, real-time telemetry, energy analytics, and reusable 3D components, the platform is being developed towards a scalable Building Energy Management and Digital Twin solution.

---

<<<<<<< HEAD
=======
## Contributing & Development Notes

This repository is evolving rapidly. Keep code-generated 3D models, simulation logic, UI pages and telemetry integrations modular, and avoid placing credentials in React client code. Confirm behavior in the browser and run `npm run build` before pushing changes.

For normal updates to the existing GitHub remote:

```bash
git status
git add .
git diff --cached --name-only  # Review staged files for secrets
git commit -m "Describe the feature or fix"
git push origin main
```

Only push to `main` if that is the branch and workflow your team intends to update.

---

>>>>>>> 7093087 (docs: update SWYTCHO README and add CI/CD workflow)
**Project:** SWYTCHO  
**Development:** Active  
**Primary Focus:** Society Energy Management and Building Digital Twin  
**Version:** Initial Development / Integration Stage
