# SWYTCHO – Smart Society Energy Management Platform

<p align="center">
  <strong>Smart Energy Monitoring • Society Management • Building Digital Twin</strong>
</p>

<p align="center">
  An integrated platform for monitoring, analyzing, and managing electricity consumption and infrastructure across residential societies and other building environments.
</p>

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

# 2. Major Project Modules

SWYTCHO is organized around several interconnected modules.

| Module | Primary Purpose |
|---|---|
| Today Dashboard | Society-wide energy overview and operational monitoring |
| Energy Monitoring | Live electrical readings and consumption analysis |
| SocietyMap | Building and society visualization |
| Floorcraft | Floor-plan and 3D building visualization |
| Building Digital Twin | Interactive 3D building representation |
| Smart Meter Management | Meter registration, mapping, and monitoring |
| Bill Copilot | Electricity bill management and analysis |
| Appliance Management | Appliance information and energy estimation |
| Infrastructure Management | Electrical, mechanical, and utility infrastructure |
| Database Management | Centralized society and building information |

The modules are being developed progressively and are not all production-ready.

---

# 3. Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | Component-based frontend development |
| TypeScript | Type safety and maintainable application code |
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

| Technology | Purpose |
|---|---|
| Git | Version control |
| GitHub | Source code hosting and collaboration |
| DBeaver | Database development and inspection |
| VS Code | Development environment |
| Docker | Containerization and isolated execution where required |
| npm | Package management |

---

# 4. Today – Society Energy Dashboard

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

# 5. InfluxDB – Live Electrical Telemetry

InfluxDB Cloud is used for storing and retrieving time-series electrical measurements.

The frontend integration communicates with the InfluxDB Query API using Flux.

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

# 6. Supabase – Database Architecture

Supabase is the central database platform for storing structured society, building, consumer, appliance, meter, and energy-related information.

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

# 7. Bill Copilot – Electricity Bill Management

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

# 8. SocietyMap – Society and Building Visualization

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

# 9. Floorcraft – Floor Plan and 3D Visualization

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

# 10. Building Digital Twin – 3D Models

The new Building Digital Twin module is being developed using React Three Fiber and Three.js.

The current implementation focuses on code-generated building geometry and user-specific building assignments.

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

# 11. Infrastructure Management

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

These are planned infrastructure components. The reusable 3D library is not yet complete.

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

# 12. Smart Meter and Appliance Management

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

# 13. Society Map and Satellite Visualization

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

# 14. Data and System Architecture

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

# 15. Proposed Project Folder Organization

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

# 16. Current Development Status

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
| Supabase authentication | Planned |
| Database-driven building assignments | Planned |
| GLB loading through Supabase Storage | Planned |
| Floor-wise new-model navigation | Planned |
| Flat and room visualization | Planned |
| Appliance placement in new 3D system | Planned |
| Reusable infrastructure library | Planned |
| Smart meter mapping to 3D models | Planned |
| Live telemetry in 3D buildings | Planned |
| Satellite society navigation | Planned |
| Premium 3D access | Planned |

---

# 17. Development Roadmap

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

- Complete the building renderer.
- Support code-generated and GLB models.
- Develop floor-wise navigation.
- Develop flat and room visualization.
- Introduce reusable 3D components.

### Phase 4 – Infrastructure and Appliances

- Build the infrastructure component library.
- Implement appliance placement.
- Add water, electrical, mechanical, and safety systems.
- Connect infrastructure components to their database records.
- Map smart meters to physical locations.

### Phase 5 – Live Energy Visualization

- Integrate InfluxDB data into the 3D environment.
- Display building-wise and floor-wise consumption.
- Visualize meter status.
- Show generator and grid supply.
- Introduce abnormal-consumption alerts.
- Add historical consumption visualization.

### Phase 6 – Advanced Building Platform

- Develop satellite-based society navigation.
- Integrate building data onboarding.
- Support multiple building categories.
- Introduce premium 3D access.
- Improve performance and deployment.
- Expand the platform to hospitals, hotels, commercial buildings, and institutional environments.

---

# 18. Future Vision

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

# 19. Project Objective

**SWYTCHO aims to connect energy data, building infrastructure, and digital visualization into one intelligent management platform.**

By combining structured building information, real-time telemetry, energy analytics, and reusable 3D components, the platform is being developed towards a scalable Building Energy Management and Digital Twin solution.

---

**Project:** SWYTCHO  
**Development:** Active  
**Primary Focus:** Society Energy Management and Building Digital Twin  
**Version:** Initial Development / Integration Stage
