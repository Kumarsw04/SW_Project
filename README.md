# SWYTCHO – Building Digital Twin & 3D Infrastructure Visualization

## Overview

The SWYTCHO Building Digital Twin module is being developed to provide an interactive 3D representation of residential societies and other building environments.

The objective is to connect physical building structures with digital information, infrastructure components, smart meters and real-time energy monitoring.

The system is designed to support multiple buildings, user-specific building assignments, floor-wise navigation, appliance placement and infrastructure monitoring.

The current development focuses on establishing the 3D building rendering system and testing dynamic building access based on user assignments.

---

## Current Development Progress

### 1. 3D Building Modelling

Two separate 3D building models have been created using code-based geometry with **React Three Fiber and Three.js**.

| Component | Description | Status |
|---|---|---|
| Building 1 | First code-generated 3D building model | Completed |
| Building 2 | Second code-generated 3D building model | Completed |
| Building Viewer | Renders multiple building models | Completed |
| Camera Controls | Supports 3D scene navigation | Implemented |
| Lighting and Environment | Provides lighting and scene presentation | Implemented |

The models were developed using GLB reference models as visual references. The current implementation uses React components and Three.js geometry rather than requiring the original GLB files at runtime.

### 2. Dynamic Building Assignment

An Excel-based building assignment demonstration has been implemented to test how different users can access different buildings.

**Assignment file:** `swytcho_user_building_assignments.xlsx`

Current sample assignments:

| Username | Assigned Buildings |
|---|---|
| user1 | Building 1 |
| user2 | Building 2 |
| user3 | Building 1 and Building 2 |

#### Working Logic

1. The application loads the Excel assignment file from the public directory.
2. The `xlsx` package reads and converts the workbook into JavaScript objects.
3. The user enters a username.
4. The application searches for matching assignment records.
5. It identifies all buildings assigned to that username.
6. The assigned building information is passed to the `BuildingViewer` component.
7. The viewer conditionally renders the corresponding 3D building models.

This demonstrates one-to-one and one-to-many building assignments.

**Note:** This is currently a demonstration using username-based lookup. It is not a production authentication system.

### 3. SocietyMap Integration

The new building assignment demonstration has been integrated into the existing SocietyMap interface.

The new implementation is maintained separately from the older building demonstration system.

This allows the new code-generated building models to be tested without changing the existing demo components.

### 4. InfluxDB Telemetry Integration

The SWYTCHO Today dashboard has also been tested with InfluxDB Cloud telemetry.

The integration retrieves electrical measurement data using Flux queries and processes the returned CSV response.

The implementation includes:

- InfluxDB Cloud API communication.
- Flux query execution.
- CSV response parsing.
- Telemetry record extraction.
- Device and channel identification.
- Electrical field-value conversion.
- Mapping of total active power and apparent power to dashboard-compatible properties.
- Latest reading and timestamp logging.

#### Successfully Retrieved Measurements

The dashboard has successfully displayed readings including:

| Measurement | Example Reading |
|---|---:|
| Active Power | 25.66 kW |
| Voltage | 237.7 V |
| Apparent Power | 28.87 kVA |

These values are examples from a successful test session and are not fixed application values.

#### Current Telemetry Limitation

Historical telemetry retrieval using a 30-day range has been successful.

However, the one-hour query has returned zero matching records during testing. The cause of the missing recent records is still under investigation.

The integration should therefore be considered partially validated rather than fully completed for continuous live monitoring.

---

## Current Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend application |
| TypeScript | Type-safe development |
| React Three Fiber | React-based 3D rendering |
| Three.js | 3D geometry and scene management |
| `@react-three/drei` | 3D scene utilities and controls |
| XLSX (`xlsx`) | Excel workbook reading |
| CSS | Component styling |
| Supabase | Planned authentication, database and storage integration |
| InfluxDB Cloud | Electrical telemetry and time-series data |
| Railway | Existing backend deployment and API integration |

---

## Current Project Structure

The following represents the main building-related files currently developed. Older demo files are retained separately.

```text
SocietyMap/
│
├── BuildingLoginDemo.tsx
├── BuildingLoginDemo.css
│
├── Building3D/
│   │
│   ├── BuildingViewer.tsx
│   ├── BuildingViewer.css
│   │
│   ├── building_1/
│   │   ├── Building1.tsx
│   │   └── Building1.css
│   │
│   └── building_2/
│       └── Building2.tsx
│
├── data/                  # Existing demo data
├── hooks/                 # Existing demo hooks
├── types/                 # Existing demo types
│
├── Appliance.tsx          # Existing demo component
├── BuildingCanvas.tsx     # Existing demo component
├── BuildingModel.tsx      # Existing demo component
├── Floor.tsx              # Existing demo component
├── FloorSelector.tsx      # Existing demo component
├── Room.tsx               # Existing demo component
│
├── SocietyMap.tsx
└── SocietyMap.css
```

The Excel assignment workbook must be available at:

```text
public/
└── swytcho_user_building_assignments.xlsx
```

---

## Planned System Architecture

The long-term architecture separates building access, 3D rendering, infrastructure data and telemetry.

```text
                    SWYTCHO APPLICATION
                            |
                            v
                    USER AUTHENTICATION
                            |
                       Supabase Auth
                            |
                            v
                    BUILDING ASSIGNMENTS
                            |
                     Supabase Database
                            |
                            v
                     BUILDING REGISTRY
                            |
                            v
                     BUILDING RENDERER
                            |
                +-----------+-----------+
                |                       |
           CODE MODELS              GLB MODELS
                |                       |
         React Three Fiber         Supabase Storage
                |                       |
                +-----------+-----------+
                            |
                            v
                      3D BUILDING VIEW
                            |
               +------------+------------+
               |            |            |
             Floors       Flats        Rooms
               |            |            |
               +------------+------------+
                            |
                +-----------+-----------+
                |                       |
          Infrastructure            Appliances
                |                       |
                +-----------+-----------+
                            |
                       SMART METERS
                            |
                            v
                    ENERGY MONITORING
                            |
                         InfluxDB
                            |
                            v
                  LIVE 3D VISUALIZATION
```

Railway will support backend APIs and business logic where required. Supabase will manage authentication, relational data and storage, while InfluxDB will provide time-series telemetry.

---

## Planned Infrastructure Components

The 3D system is intended to support reusable infrastructure components that can be placed in different building types.

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
- CCTV Systems
- Access Control Systems
- Parking Areas
- Staircases
- Common Area Lighting
- EV Charging Stations

These are planned components and have not yet been implemented in the new 3D infrastructure library.

---

## Upcoming Development

| Phase | Development Task | Status |
|---|---|---|
| 1 | Create code-generated Building 1 and Building 2 | Completed |
| 2 | Develop the Building Viewer | Completed |
| 3 | Implement Excel-based user assignment | Demonstration completed |
| 4 | Integrate the building demo into SocietyMap | Completed |
| 5 | Establish Supabase building registry and assignment tables | Planned |
| 6 | Integrate Supabase authentication | Planned |
| 7 | Implement dynamic building rendering | In progress / Planned |
| 8 | Implement GLB model loading through Supabase Storage | Planned |
| 9 | Develop floor-wise 3D navigation | Planned for new models |
| 10 | Develop flat and room visualization | Planned |
| 11 | Build reusable infrastructure components | Planned |
| 12 | Implement appliance placement | Planned |
| 13 | Map smart meters to buildings and flats | Planned |
| 14 | Integrate live telemetry into the 3D viewer | Planned |
| 15 | Implement infrastructure and energy monitoring | Planned |
| 16 | Integrate satellite-based society navigation | Planned |

---

## Development Priorities

The next development stages will focus on:

1. **Supabase Integration:** Replace the Excel-based assignment demonstration with authenticated user access and database-driven building assignments.
2. **Building Registry:** Maintain building information and model references centrally.
3. **Dynamic Model Rendering:** Support both code-generated models and GLB models.
4. **Building Navigation:** Develop the Building → Floor → Flat → Room hierarchy.
5. **Infrastructure Library:** Create reusable 3D components for electrical, mechanical, water-management and safety systems.
6. **Smart Meter Mapping:** Connect physical meter information to the corresponding building locations.
7. **Energy Visualization:** Display InfluxDB telemetry and energy-related information in the 3D environment.

---

## Project Vision

The long-term goal is to develop SWYTCHO into a reusable **Building Digital Twin and Energy Management Platform**.

The platform aims to connect the physical structure of a building with its infrastructure, electrical systems, appliances and energy consumption data.

The same architecture is intended to support different building environments, including:

- Residential Societies
- Hospitals
- Commercial Buildings
- Hotels
- Institutional Buildings

Instead of creating an entirely separate 3D system for every building, the platform will use reusable building models and infrastructure components with building-specific configurations and data.

**SWYTCHO aims to move beyond static 3D building visualization towards an interactive, data-connected digital twin.**

---

*Development Status: Active Development*# Power_Consumption_Dashboard
