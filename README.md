# GoldenHour 🚨 — Help Before the Ambulance Arrives

> A safety-first emergency response coordination web platform designed for rural and semi-urban communities in India.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo (Render)](https://img.shields.io/badge/Live%20Demo-Render%20HTTPS-brightgreen.svg)](https://goldenhour-emerency.onrender.com/)
[![Live Demo (GitHub Pages)](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue.svg)](https://vishal-s-sollapure.github.io/GoldenHour/)
[![Node.js Runtime](https://img.shields.io/badge/Node.js-Built--in%20HTTP-green.svg)](https://nodejs.org)
[![Tests Passing](https://img.shields.io/badge/Tests-12%2F12%20Passed-brightgreen.svg)](tests/api.test.js)
[![Emergency Dialer](https://img.shields.io/badge/Emergency%20Dialer-India%20112-red.svg)](tel:112)

🌐 **Live Deployed Environments:**
* **Full-Stack Application (Render):** [https://goldenhour-emerency.onrender.com/](https://goldenhour-emerency.onrender.com/)  
  *(API Health Endpoint: [https://goldenhour-emerency.onrender.com/api/health](https://goldenhour-emerency.onrender.com/api/health))*
* **Static Client Deployment (GitHub Pages):** [https://vishal-s-sollapure.github.io/GoldenHour/](https://vishal-s-sollapure.github.io/GoldenHour/)  
* **GitHub Repository:** [https://github.com/vishal-s-sollapure/GoldenHour](https://github.com/vishal-s-sollapure/GoldenHour)

---

## 📑 Table of Contents
1. [Introduction & Problem Statement](#1-introduction--problem-statement)
2. [Target Audience & User Personas](#2-target-audience--user-personas)
3. [Key Capabilities](#3-key-capabilities)
4. [Application Views & Interface Layout](#4-application-views--interface-layout)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture Diagram](#6-system-architecture-diagram)
7. [End-to-End Application Workflow](#7-end-to-end-application-workflow)
8. [Frontend & Backend Architecture](#8-frontend--backend-architecture)
9. [API Specification](#9-api-specification)
10. [Database & Storage Architecture](#10-database--storage-architecture)
11. [Installation & Local Startup](#11-installation--local-startup)
12. [Environment Configuration](#12-environment-configuration)
13. [Automated Testing & Verified Results](#13-automated-testing--verified-results)
14. [Security & Privacy Considerations](#14-security--privacy-considerations)
15. [Clinical Content Attribution & Medical Boundaries](#15-clinical-content-attribution--medical-boundaries)
16. [Deployment Architecture](#16-deployment-architecture)
17. [Known Limitations](#17-known-limitations)
18. [Future Development Roadmap](#18-future-development-roadmap)
19. [Contribution Guidelines](#19-contribution-guidelines)
20. [License Information](#20-license-information)

---

## 1. Introduction & Problem Statement

In severe medical emergencies—such as sudden cardiac arrest, massive traumatic hemorrhage, and acute airway obstruction—the first **5 to 15 minutes** prior to professional ambulance arrival determine survival. In clinical medicine, this initial window is recognized as the critical pre-hospital phase of the **Golden Hour**.

In rural, semi-urban, and congested urban regions across India, bystanders frequently hesitate to intervene due to:
* **Acute Panic & Lack of Protocols**: Bystanders are uncertain what physical actions are clinically safe.
* **Linguistic Barriers**: Emergency guidance is predominantly published in English rather than regional languages.
* **Location Ambiguity**: Distressed callers struggle to describe exact street landmarks to dispatchers or family.
* **Complex App Barriers**: Most emergency software requires mandatory user registration, mobile number OTP verification, or extensive permission dialogues before dialing emergency services.

### Core Mission & Safety Notice
**GoldenHour** bridges this pre-hospital gap by giving bystanders **instant access to India's National Emergency Helpline (112)**, **clinically formulated multilingual Basic Life Support (BLS) instructions**, an **interactive 110 BPM CPR metronome**, and **instant GPS coordinate sharing**.

> ⚠️ **Important Safety Notice & Clinical Boundaries**:  
> * **Not an Ambulance Dispatcher**: GoldenHour is an educational bystander assistance platform. It **does not dispatch real municipal ambulances or emergency medical service (EMS) crews**.
> * **Dialer Action**: Clicking "Call 112" opens the device's native telephone dialer (`tel:112`). Web browsers cannot verify whether the call was completed, answered, or connected.
> * **Non-Diagnostic Policy**: The application does not collect symptoms, calculate diagnostic risk scores, recommend pharmaceutical drugs, or replace certified healthcare professionals.
> * **No Clinical Certification**: GoldenHour has not been evaluated or certified as a medical device by the Central Drugs Standard Control Organisation (CDSCO), US FDA, or European CE.

---

## 2. Target Audience & User Personas

GoldenHour requires **zero registration, login, or app store downloads**, functioning directly in modern mobile and desktop browsers:

1. **Bystanders & General Public (Primary Responders)**:
   * Individuals present at an emergency scene (pedestrians, family members, co-workers).
   * Need zero-delay dialing to 112, step-by-step CPR guidance, and one-tap emergency SMS/WhatsApp dispatch to relatives.
2. **Community First Responders & Volunteers (Simulated MVP)**:
   * CPR-certified residents, Red Cross first-aiders, NCC/NSS volunteers, and Good Samaritans.
   * Can evaluate a simulated 1 km proximity radar showing nearby alerts to provide early chest compressions before the ambulance arrives.
3. **Hospital Trauma Desks & Triage Teams (Simulated MVP)**:
   * Emergency department triage nurses and trauma team coordinators.
   * Demonstrates incoming patient triage payloads (`INC-2026-8901`), dynamic ETA countdowns, and trauma bay prep workflows.
4. **Rural & Non-English Speaking Communities**:
   * Specifically tailored for linguistic diversity in India, providing synchronized guidance in **Kannada (ಕನ್ನಡ)**, **Hindi (हिंदी)**, and **English**.

---

## 3. Key Capabilities

* **Unblocked India 112 Direct Dialer**: Direct telephone link (`tel:112`) placed prominently at the top of the interface. Operates independently of server health, database availability, or location permissions.
* **Trilingual Basic Life Support Guidance**: Standardized instructions for Adult CPR, Severe Hemorrhage Control, and Recovery Position in English, Hindi, and Kannada.
* **Audio CPR Compression Metronome (110 BPM)**: Native browser Web Audio API oscillator delivering rhythmic auditory clicks (110 beats/min) with a high-pitch tone accenting beat 1 of each 30-compression cycle.
* **Browser Voice Narration (Text-to-Speech)**: Integrated Web Speech API (`window.speechSynthesis`) reading first-aid steps aloud so rescuers can keep their hands on the patient.
* **Dynamic OpenStreetMap & GPS Integration**: Embedded Leaflet map displaying real GPS coordinates, manual tap-to-pin, marker dragging, daylight/dark map toggle, and Nominatim reverse geocoding.
* **One-Tap Contact SOS Dispatch**: Pre-formats localized SMS and WhatsApp distress messages containing live Google Maps links and physical street addresses.
* **Demonstration Proximity Radar & Pre-Alert Desk**: Interactive simulation showing how community responders and hospital trauma bays coordinate during an incident.
* **Verifiable Audit Event Ledger**: Chronological append-only event logging tracking bystander actions (`INCIDENT_CREATED`, `112_CALLED`, `CPR_STARTED`) to measure response times.

---

## 4. Application Views & Interface Layout

GoldenHour provides dedicated views accessible via the responsive navigation bar:

| View Name | Source File | Description | Interface Preview |
| :--- | :--- | :--- | :---: |
| **Emergency SOS Dashboard** | [`index.html`](index.html) | Primary emergency screen. Direct 112 call button, SOS trigger, Leaflet map with emergency pin, and WhatsApp/SMS contact sharing. | `index.html` |
| **Verified First-Aid Guidance** | [`first-aid.html`](first-aid.html) | Step-by-step clinical instructions, 110 BPM CPR audio metronome, language selector (`en`/`hi`/`kn`), and medical attributions. | `first-aid.html` |
| **Volunteer Radar (Simulated)** | [`dashboard.html`](dashboard.html) | Simulated 1 km radius responder radar demonstrating responder status changes (`Available` &rarr; `Accepted (En Route)`). | `dashboard.html` |
| **Hospital Pre-Alert Desk** | [`dashboard.html`](dashboard.html) | Simulated trauma department triage console receiving incoming incident payloads with estimated arrival times. | `dashboard.html` |
| **Incident History & Safety Metrics** | [`history.html`](history.html) | Audit log table, chronological event history, and safety & privacy compliance verification matrix. | `history.html` |

> *Note on Visual Documentation*: Previews and screenshots can be placed in [`docs/screenshots/`](docs/screenshots/) for offline distribution.

---

## 5. Technology Stack

### Backend Core
* **Runtime**: [Node.js](https://nodejs.org/) (Version 16.x or higher).
* **Architecture**: Standalone HTTP server ([`server.js`](server.js)) written using Node's standard built-in modules:
  * `http`: High-throughput request handling and routing.
  * `fs`: Atomic persistence, backup generation, and static file streaming.
  * `path`: Cross-platform path resolution and directory traversal sanitization.
  * `url`: URL path and parameter parsing.
* **Zero Required Dependencies**: The production server runs immediately via `node server.js` without running `npm install`.
* **Optional Framework Modules**: Express (`^4.19.2`) and CORS (`^2.8.5`) are declared in [`package.json`](package.json) and organized in [`src/routes/`](src/routes/) for modular environments.

### Frontend Client
* **Core Markup & Styling**: HTML5, Vanilla CSS3 (CSS custom properties, CSS Grid, Flexbox, glassmorphism design tokens). Zero UI libraries.
* **Interactive Mapping**: [Leaflet v1.9.4](https://leafletjs.com/) with OpenStreetMap CDN tile servers (`tile.openstreetmap.org`).
* **Audio Synthesis**: Native **Web Audio API** (`AudioContext`) generating low-latency synthetic sine waves for CPR rhythm pacing.
* **Voice Synthesis**: Native **Web Speech API** (`window.speechSynthesis`) for local device text-to-speech.
* **Storage**: In-memory client state with optional browser `localStorage` integration for emergency contacts.

---

## 6. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Client Web Browser (Desktop / Mobile)"]
        UI["GoldenHour Frontend UI<br/>(HTML5 / CSS3 / Vanilla JS)"]
        Dialer["Native Device Telephone Dialer<br/>(tel:112)"]
        AudioEngine["Web Audio API<br/>(110 BPM CPR Oscillator)"]
        SpeechEngine["Web Speech API<br/>(TTS Audio Readouts)"]
        Geolocation["Browser Geolocation API<br/>(GPS Coordinates)"]
        SimEngines["Simulation Engines<br/>(volunteers.js & hospital.js)"]
    end

    subgraph ExternalServices["External Cloud & Network Services"]
        OSM_Tiles["OpenStreetMap Tile CDN<br/>(tile.openstreetmap.org)"]
        Nominatim["OSM Nominatim API<br/>(Reverse Geocoding)"]
        WhatsAppDispatch["WhatsApp Dispatch Gateway<br/>(wa.me API)"]
    end

    subgraph BackendServer["Node.js Application Server (server.js)"]
        Router["HTTP Request Dispatcher"]
        BodyParser["Request Body Parser & 100 KB Limiter"]
        CORS_Handler["CORS Header Policy Filter"]
        StaticServer["Static File Server & CWE-22 Guard"]
        APIRoutes["REST API Endpoints (/api/*)"]
    end

    subgraph PersistenceLayer["Persistent Datastore"]
        DBEngine["JSON Database Engine<br/>(src/db/database.js)"]
        PrimaryDB[("goldenhour_db.json<br/>(Primary Store)")]
        BackupDB[("goldenhour_db.json.bak<br/>(Automated Backup)")]
        SchemaDoc["SQLite Reference Schema<br/>(src/db/schema.sql)"]
    end

    UI -->|1. Tap 112 Call| Dialer
    UI -->|2. Start Metronome| AudioEngine
    UI -->|3. Listen to Guidance| SpeechEngine
    UI -->|4. Detect Location| Geolocation
    Geolocation -->|Reverse Geocode| Nominatim
    UI -->|Fetch Map Graphics| OSM_Tiles
    UI -->|Share Coordinates| WhatsAppDispatch
    UI -->|Evaluate Simulations| SimEngines

    UI <-->|REST JSON (CORS)| BackendServer
    Router --> BodyParser
    BodyParser --> APIRoutes
    Router --> StaticServer
    APIRoutes <--> DBEngine
    DBEngine -->|Atomic Rename (.tmp -> file)| PrimaryDB
    DBEngine -->|Pre-save Sync Copy| BackupDB
    DBEngine -.->|Relational Reference| SchemaDoc
```

---

## 7. End-to-End Application Workflow

```text
+-----------------------------------------------------------------------------------+
| 1. IMMEDIATE ACTION: 112 DIALER                                                   |
| Bystander taps "CALL INDIA 112 NOW" -> Launches device phone dialer immediately   |
| Zero network delays, zero login screens, zero mandatory permissions.              |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
| 2. CLINICAL FIRST-AID & PACING                                                    |
| Bystander opens First-Aid tab -> Selects Kannada, Hindi, or English.              |
| Starts 110 BPM Metronome -> Keeps hands on victim's chest to maintain rate.      |
| Taps "Read Aloud" -> Browser speaks instructions step-by-step.                    |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
| 3. LOCATION & CONTACT DISPATCH                                                    |
| Browser requests GPS -> Lat/Lng pinned to Leaflet Map.                            |
| Nominatim resolves street address.                                                |
| Bystander taps "Share via WhatsApp" -> Generates pre-filled SMS/WhatsApp message. |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
| 4. COORDINATION SIMULATIONS (MVP DEMONSTRATION)                                   |
| Bystander triggers SOS -> Simulated nearby responders appear on 1km radar.         |
| Simulated hospital trauma desk receives patient payload & 6-min ETA alert.        |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
| 5. AUDIT EVENT LOGGING                                                            |
| Chronological action ledger records timestamps: 112_CALLED, CPR_STARTED, etc.     |
| Verifies response speed and safety compliance in incident history.                |
+-----------------------------------------------------------------------------------+
```

---

## 8. Frontend & Backend Architecture

### Directory Structure Layout

```text
GoldenHour/
├── index.html                  # Main Single Page Application (SOS, Leaflet map, contacts)
├── first-aid.html              # Dedicated trilingual first-aid guides & CPR metronome view
├── dashboard.html              # Dedicated simulation dashboard (Volunteer radar & Trauma desk)
├── history.html                # Dedicated incident audit log & safety metrics view
├── server.js                   # Primary runtime server (Node.js standard library, zero dependencies)
├── package.json                # Project manifest (dependencies, scripts, metadata)
├── render.yaml                 # Infrastructure-as-code deployment blueprint for Render
├── goldenhour_db.json          # Primary persistent JSON database
├── LICENSE                     # MIT Open Source License
├── README.md                   # Comprehensive platform documentation
├── RELEASE_NOTES.md            # Release milestones, changelog, and verified metrics
├── css/
│   └── style.css               # Design system tokens (#FF3B30, #007AFF), glassmorphism styles
├── js/
│   ├── app.js                  # Primary client controller (navigation, map, GPS, contacts)
│   ├── translations.js         # Trilingual clinical dictionaries (English, Hindi, Kannada)
│   ├── metronome.js            # 110 BPM Web Audio API oscillator for CPR pacing
│   ├── volunteers.js           # Client-side volunteer radar simulation engine
│   ├── hospital.js             # Client-side hospital trauma pre-alert simulation engine
│   └── metrics.js              # In-memory bystander response timeline & audit metrics
├── src/
│   ├── server.js               # Facade exporting root server.js
│   ├── db/
│   │   ├── database.js         # Atomic JSON persistence engine with automated .bak backup
│   │   └── schema.sql          # Relational SQLite reference schema
│   ├── middleware/
│   │   └── validation.js       # Express input validation middleware functions
│   ├── routes/
│   │   ├── incidents.js        # Express incidents router
│   │   ├── events.js           # Express chronological events router
│   │   └── demo-alerts.js      # Express simulated volunteer and hospital alerts router
│   └── services/
│       └── incident-service.js # Incident domain logic and event creation
├── tests/
│   └── api.test.js             # Zero-dependency regression test suite (12/12 passing)
└── docs/
    └── screenshots/            # Directory for application screenshots
```

---

## 9. API Specification

All backend endpoints are served under `/api` and return `application/json; charset=UTF-8`.

### 1. Health Check
* **Route**: `GET /api/health`
* **Description**: Verifies server health, unblocked call policy, and simulation declarations.
* **Example Response (200 OK)**:
  ```json
  {
    "status": "OK",
    "app": "GoldenHour",
    "tagline": "Help Before the Ambulance Arrives",
    "priorityCall": "India 112 unblocked",
    "nonDiagnostic": true,
    "demoOnly": true,
    "timestamp": "2026-11-20T13:30:00.000Z"
  }
  ```

### 2. List Incidents
* **Route**: `GET /api/incidents`
* **Description**: Returns all persistent emergency incidents.
* **Example Response (200 OK)**:
  ```json
  {
    "demoOnly": true,
    "total": 1,
    "incidents": [
      {
        "id": "INC-2026-1001",
        "status": "ACTIVE",
        "language": "en",
        "location_lat": 12.9716,
        "location_lng": 77.5946,
        "location_address": "MG Road, Indiranagar, Bengaluru",
        "created_at": "2026-11-20T10:00:00.000Z",
        "resolved_at": null
      }
    ]
  }
  ```

### 3. Create Incident
* **Route**: `POST /api/incidents`
* **Description**: Records a new emergency incident and automatically generates an `INCIDENT_CREATED` audit event.
* **Request Headers**: `Content-Type: application/json`
* **Example Request Body**:
  ```json
  {
    "language": "kn",
    "location_lat": 12.9716,
    "location_lng": 77.5946,
    "location_address": "Indiranagar, Bengaluru, Karnataka"
  }
  ```
* **Validation Rules**:
  * `language`: Must be one of `en`, `hi`, `kn`.
  * `location_lat`: Number between `-90` and `90`.
  * `location_lng`: Number between `-180` and `180`.
* **Example Response (201 Created)**:
  ```json
  {
    "success": true,
    "demoOnly": true,
    "incident": {
      "id": "INC-2026-4821",
      "status": "ACTIVE",
      "language": "kn",
      "location_lat": 12.9716,
      "location_lng": 77.5946,
      "location_address": "Indiranagar, Bengaluru, Karnataka",
      "created_at": "2026-11-20T13:31:00.000Z",
      "resolved_at": null
    }
  }
  ```

### 4. Get Incident by ID
* **Route**: `GET /api/incidents/:id`
* **Description**: Retrieves a single incident along with all chronological event log records.
* **Example Response (200 OK)**:
  ```json
  {
    "demoOnly": true,
    "incident": {
      "id": "INC-2026-1001",
      "status": "ACTIVE",
      "language": "en"
    },
    "events": [
      {
        "id": "EVT-1001-1",
        "incident_id": "INC-2026-1001",
        "event_type": "INCIDENT_CREATED",
        "details": "Emergency SOS initiated via GoldenHour app",
        "created_at": "2026-11-20T10:00:00.000Z"
      }
    ]
  }
  ```
* **Error Response**: `404 Not Found` if incident ID does not exist.

### 5. Append Chronological Event
* **Route**: `POST /api/incidents/:id/events`
* **Description**: Appends a verifiable action taken by a bystander to an incident timeline.
* **Example Request Body**:
  ```json
  {
    "event_type": "CPR_STARTED",
    "details": "110 BPM metronome initiated by bystander"
  }
  ```
* **Validation**: `event_type` is required and must be a non-empty string.
* **Example Response (201 Created)**:
  ```json
  {
    "success": true,
    "demoOnly": true,
    "event": {
      "id": "EVT-1732109460000",
      "incident_id": "INC-2026-1001",
      "event_type": "CPR_STARTED",
      "details": "110 BPM metronome initiated by bystander",
      "created_at": "2026-11-20T13:32:00.000Z"
    }
  }
  ```

### 6. Simulation & Metrics Endpoints
* **`GET /api/demo/volunteers`**: Returns synthetic community responders within a 1 km radius (`demo_only: 1`).
* **`POST /api/demo/alerts`**: Generates a simulated volunteer or hospital notification (`demo_only: 1`).
* **`GET /api/demo/alerts`**: Returns active mock alert records.
* **`GET /api/demo/hospitals`**: Returns synthetic Level-1 trauma center pre-alert records.
* **`GET /api/metrics`**: Returns aggregated platform counts (incidents, events, alerts, registered volunteers).
* **`GET /api/test-run`**: In-process test runner endpoint executing regression checks on demand.

---

## 10. Database & Storage Architecture

### Atomic File Replacement Pattern
To prevent database file corruption caused by mid-write server termination or sudden power loss, [`src/db/database.js`](src/db/database.js) implements an **atomic replacement write cycle**:

1. **In-Memory Cache**: All queries and mutations operate directly against an in-memory JavaScript state object.
2. **Temporary File Generation**: Data is serialized to formatted JSON and written to a temporary file:  
   `goldenhour_db.json.tmp.<timestamp>.<rand>`
3. **Automated Backup**: Before replacing the primary file, the existing database is copied synchronously to `goldenhour_db.json.bak`.
4. **Atomic Rename**: `fs.renameSync()` replaces `goldenhour_db.json` with the temporary file in a single filesystem operation.

### Disaster Recovery Mechanism
When `load()` executes during server initialization:
1. It attempts to parse `goldenhour_db.json`.
2. If the file is missing or contains invalid JSON syntax, it catches the error and attempts recovery from `goldenhour_db.json.bak`.
3. If both files are unreadable, it re-seeds the datastore using the hardcoded default demonstration state.

### Relational Schema Blueprint
The repository includes a complete relational schema definition in [`src/db/schema.sql`](src/db/schema.sql) documenting the target relational structure (`incidents`, `incident_events`, `demo_volunteers`, `demo_alerts`, `demo_hospitals`) for planned migration to SQLite.

---

## 11. Installation & Local Startup

### Prerequisites
* **Node.js**: Version 16.0 or higher.
* **Web Browser**: Chrome, Edge, Firefox, or Safari (supporting Web Audio API and Geolocation).

### Quick Start (Zero Dependencies)
Because GoldenHour runs on Node's standard library, no package downloads are needed:

```bash
# 1. Clone the repository
git clone https://github.com/vishal-s-sollapure/GoldenHour.git

# 2. Enter directory
cd GoldenHour

# 3. Start server
node server.js
# OR: npm start
```

Open your browser at:
```text
http://localhost:3000
```

### Optional Express Installation
If you wish to run with Express middleware enabled:
```bash
npm install
npm start
```

---

## 12. Environment Configuration

The application reads configuration values directly from `process.env`. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

| Variable | Default Value | Purpose |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port for the HTTP server to listen on. |
| `NODE_ENV` | `development` | Environment mode (`development` or `production`). |
| `ALLOWED_ORIGIN` | `*` | Allowed CORS origin header. Set to specific domain in production. |
| `SIMULATION_MODE` | `true` | Enforces explicit synthetic labels across demo components. |

*Note on Local `.env` Loading*: The core server (`server.js`) uses Node built-in modules without the `dotenv` package. To load `.env` variables in Node 20.6+, start with:
```bash
node --env-file=.env server.js
```

---

## 13. Automated Testing & Verified Results

The repository features an in-process acceptance and regression test suite in [`tests/api.test.js`](tests/api.test.js). It executes using Node's standard `assert` module without third-party test runners.

### Running Tests
```bash
npm test
# OR directly:
node tests/api.test.js
```

### Verified Test Results (12/12 Passed)
```text
===============================================================
🧪 Running GoldenHour Final Release Readiness Regression Tests
===============================================================

✅ Passed (1): T1: Database initializes with valid incidents and volunteers arrays
✅ Passed (2): T2: Incident creation persists language, location, and valid ID
✅ Passed (3): T3: Traceable event appended chronologically upon incident creation
✅ Passed (4): T4: All mock records strictly enforce demo_only: 1
✅ Passed (5): T5: Volunteer status transitions correctly in demo workflow
✅ Passed (6): T6: Input validation rejects unsupported languages (e.g. es, fr)
✅ Passed (7): T7: Input validation rejects latitude out of [-90, 90] bounds
✅ Passed (8): T8: Input validation rejects empty event_type
✅ Passed (9): T9: getIncidentById returns record for valid ID, undefined for invalid
✅ Passed (10): T10: Atomic save writes temporary file and protects main database file
✅ Passed (11): T11: Concurrent rapid saves do not corrupt JSON file
✅ Passed (12): T12: Direct 112 emergency dialer constraint strictly maintained

===============================================================
🎉 ALL 12/12 REGRESSION & ACCEPTANCE TESTS PASSED!
GoldenHour meets all safety, validation, and persistence standards.
===============================================================
```

---

## 14. Security & Privacy Considerations

### Security Controls
1. **Path Traversal Protection (CWE-22)**: Static file serving in `server.js` resolves requested paths against a normalized directory boundary (`normalizedBase`) to prevent directory escape attacks. Requests targeting parent directories receive `403 Access Denied`.
2. **Denial-of-Service Request Limit (CWE-400)**: All JSON request streams enforce a strict **100 KB payload ceiling**. Payloads exceeding this threshold are aborted with `413 Payload Too Large`.
3. **Strict Coordinate & Language Validation**: Coordinates are validated within genuine mathematical ranges (latitude -90 to 90; longitude -180 to 180), and language codes are restricted to supported locales (`en`, `hi`, `kn`).

### Privacy & Network Transmissions
* **Location Privacy**: GPS coordinates stay on the user's device and are not stored in remote databases unless an incident is explicitly submitted.
* **Third-Party Transmissions**:
  * **OpenStreetMap Tile CDN** (`tile.openstreetmap.org`): Standard HTTP image requests to render road graphics. No identity tokens or user data transmitted.
  * **Nominatim Geocoding API** (`nominatim.openstreetmap.org`): Transmits coordinates solely when the user clicks "Detect GPS", searches an area, or manually pins a location.
  * **Web Speech API**: Voice processing occurs locally or via the vendor's browser speech engine depending on the user's operating system.

---

## 15. Clinical Content Attribution & Medical Boundaries

All first-aid guidance adheres to published international and national resuscitation guidelines:

### Clinical Guidance Standards
1. **Adult Cardiopulmonary Resuscitation (CPR)**:
   * **Guideline References**: European Resuscitation Council (ERC 2025) Basic Life Support Guidelines & Indian Resuscitation Council (IRC) Comprehensive Cardiopulmonary Life Support (CCLS).
   * **Target Rate & Depth**: **110 BPM** (clinically verified range: 100–120 compressions per minute) at a compression depth of 5–6 cm.
   * **Trained vs Untrained**: Trained rescuers are instructed to deliver 30 compressions followed by 2 breaths. Untrained bystanders are instructed to perform continuous **hands-only CPR** without interruptions.
2. **Severe Hemorrhage Control**:
   * **Protocol**: Immediate direct firm pressure &rarr; Wound packing with sterile dressing or clean cloth &rarr; Pressure bandage.
   * **Tourniquet Protocol**: Applied 5–7 cm proximal to the wound (never over a joint) for life-threatening limb hemorrhage. Protocol enforces writing the exact application time on the patient or band.
3. **Recovery Position**:
   * **Indication**: Unresponsive individual breathing normally. Step-by-step lateral positioning to maintain airway patency and prevent aspiration.

### Strict Anti-Hallucination Policy
* **Zero Generative AI for Medical Instructions**: GoldenHour strictly **does not use Large Language Models (LLMs)** to generate medical recommendations dynamically. All instructions are hardcoded, peer-reviewed clinical procedures.
* **Priority Invariant**: Every screen reminds the rescuer that calling **112** is always the primary step.

---

## 16. Deployment Architecture

### 1. Cloud Web Service (Render)
* **Configuration**: Defined in [`render.yaml`](render.yaml).
* **Region**: Singapore (`singapore`).
* **Health Check**: Automated uptime monitoring querying `/api/health`.
* **Runtime**: Node.js web service running `npm start`.

### 2. Static Web Hosting (GitHub Pages)
* **Repository Deployment**: Deployed from repository root.
* **Full Client Functionality**: Because first-aid guides, the 110 BPM audio metronome, GPS capture, and mock simulation dashboards run 100% in client-side JavaScript, the GitHub Pages deployment functions as a standalone client demo.

---

## 17. Known Limitations

1. **Telephony Limitation**: The 112 button triggers `tel:112` in the device browser. Web browsers cannot detect whether the emergency call connected, was answered, or was disconnected.
2. **Single-File Persistence Scale**: The JSON database uses atomic file renaming which prevents partial write corruption on a single instance. However, it does not support distributed multi-instance file locking under horizontal autoscaling.
3. **Simulation Boundaries**: Community responder alerts and hospital trauma bay alerts are educational demonstrations (MVP) and do not connect to real municipal 108/112 ambulance fleets.
4. **Third-Party API Rate Limits**: Reverse geocoding depends on the public OpenStreetMap Nominatim API, subject to standard fair-use rate limits.

---

## 18. Future Development Roadmap

* [ ] **Phase 1: SQLite Persistence Migration**: Transition `src/db/database.js` to an embedded SQLite datastore with Write-Ahead Logging (WAL) matching `src/db/schema.sql`.
* [ ] **Phase 2: Formal ERSS 112 Gateway Integration**: Partner with state emergency authorities to enable direct digital dispatch payloads via official ERSS APIs.
* [ ] **Phase 3: WebRTC Real-Time Responder Channel**: Introduce live peer-to-peer telemetry between verified community first-responders and bystanders.
* [ ] **Phase 4: Offline PWA Service Worker**: Implement offline tile caching and asset caching for first-aid guidance in zero-connectivity rural zones.
* [ ] **Phase 5: Formal Clinical Board Review**: Conduct formal review and validation with certified emergency medicine specialists.

---

## 19. Contribution Guidelines

Contributions are welcomed from developers, emergency medical professionals, and translators:

1. **Safety First**: Never introduce dependencies or UX friction that obstruct the immediate availability of the 112 dialer.
2. **Zero Generative AI for Medical Procedures**: All clinical text additions must be sourced from published, accredited clinical resuscitation councils.
3. **Zero Required NPM Dependencies**: Ensure core runtime scripts execute using standard Node.js libraries.
4. **Test Before Submitting**: Run `npm test` and ensure all 12 regression tests pass prior to submitting a pull request.

---

## 20. License Information

This project is open-source and licensed under the [MIT License](LICENSE).

```text
Copyright (c) 2026 Vishal S. Sollapure & GoldenHour Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```
