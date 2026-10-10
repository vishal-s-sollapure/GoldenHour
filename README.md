# GoldenHour 🚨 — Help Before the Ambulance Arrives

> **Complete Ideathon & Technical Blueprint Implementation**
> A safety-first emergency response coordination web application designed for rural and semi-urban communities.

---

## 🌟 1. Project Vision & Core Differentiation

In an emergency, the first few minutes can be confusing for bystanders. **GoldenHour** focuses on the critical gap between recognizing an emergency and receiving professional assistance.

Unlike standard ambulance locators, GoldenHour delivers:
- **Instant Access to India 112**: Unblocked emergency calling independent of backend or permissions.
- **Clinically Verified First Aid in 3 Languages**: Kannada, Hindi, and English instructions with audio metronome (110 BPM) and Text-to-Speech (TTS).
- **Consent-Based Location & Contact Sharing**: Generate instant WhatsApp and SMS location share links.
- **Coordination Simulation (MVP)**: Proximity radar for nearby community volunteers and a hospital emergency triage desk pre-alert dashboard.
- **Traceable Event History & Safety Metrics**: Measurable time-to-first-action and verifiable audit logs.

> **Safety Boundary**: GoldenHour never diagnoses medical conditions, replaces emergency services, or misrepresents simulated demo alerts as real dispatches.

---

## 🏛️ 2. Technical Architecture

```
GoldenHour/
├── public / root
│   ├── index.html           # Main mobile-first application & SOS hub
│   ├── first-aid.html       # Dedicated high-contrast multilingual first-aid guides
│   ├── dashboard.html       # Volunteer radar & hospital pre-alert simulation desk
│   ├── history.html         # Persistent SQLite incident history & safety metrics
│   ├── css/
│   │   └── style.css        # Emergency design tokens (dark slate, crimson, glassmorphism)
│   └── js/
│       ├── app.js           # Geolocation, 112 direct call, TTS engine, and state logic
│       ├── translations.js  # English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ) strings
│       ├── metronome.js     # Web Audio API 110 BPM CPR compression metronome
│       ├── volunteers.js    # Simulated nearby volunteer radar engine
│       ├── hospital.js      # Hospital trauma desk pre-alert dashboard prototype
│       └── metrics.js       # Live time-to-action tracker & safety compliance auditor
├── src/
│   ├── server.js            # Node HTTP / Express API server
│   ├── routes/
│   │   ├── incidents.js     # /api/incidents route handler
│   │   ├── events.js        # /api/incidents/:id/events route handler
│   │   └── demo-alerts.js   # /api/demo/volunteers, /api/demo/alerts, /api/demo/hospitals
│   ├── services/
│   │   └── incident-service.js # Incident business logic & traceable logging
│   ├── db/
│   │   ├── database.js      # Persistent storage layer with disk file sync
│   │   └── schema.sql       # Relational SQLite schema with synthetic seed data
│   └── middleware/
│       └── validation.js    # Request validation & sanitization
├── tests/
│   └── api.test.js          # Acceptance criteria verification test suite
├── goldenhour_db.json       # Persistent data store (survives server restarts)
├── package.json             # NPM scripts and configuration
└── README.md                # Technical blueprint documentation
```

---

## 🚀 3. How to Run Locally

### Option A: Node.js Server (Recommended — Zero NPM Install Needed!)
The backend server is built with universal compatibility. It runs out of the box using Node's standard modules:

1. Open your terminal in `C:\Users\vinay\OneDrive\Desktop\GoldenHour`
2. Run:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```
   - Main SOS App: `http://localhost:3000/index.html`
   - First-Aid Guides: `http://localhost:3000/first-aid.html`
   - Volunteer & Hospital Radar: `http://localhost:3000/dashboard.html`
   - Incident Audit History: `http://localhost:3000/history.html`

### Option B: Direct Browser Opening (No Server Required)
Double-click [index.html](file:///C:/Users/vinay/OneDrive/Desktop/GoldenHour/index.html) or open it in Google Chrome. All client features (112 dialing, multilingual guides, CPR metronome, TTS, location tracking, and mock simulation) work 100% locally in offline mode!

---

## 🧪 4. Running the Acceptance Tests

Verify the database persistence, event logging, simulation isolation, and safety criteria:
```bash
node tests/api.test.js
```
Expected output:
```text
🧪 Starting GoldenHour Acceptance Verification Tests...

✅ Test 1 Passed: Database initializes with incidents array.
✅ Test 2 Passed: Incident created and language stored accurately.
✅ Test 3 Passed: Incident events logged chronologically.
✅ Test 4 Passed: All synthetic records strictly enforce demo_only: 1.
✅ Test 5 Passed: Volunteer response workflow updates correctly.

🎉 ALL ACCEPTANCE TESTS PASSED (5/5)! GoldenHour meets Blueprint standards.
```

---

## 🛡️ 5. Safety, Clinical Content & Privacy Policy

| Safety Requirement | Implementation |
| :--- | :--- |
| **Unblocked 112 Priority** | Direct `tel:112` link bypasses all permissions, form validation, and server connectivity. |
| **No Algorithmic Diagnosis** | GoldenHour does not query symptoms for medical predictions or diagnosis. |
| **Clinical Guidelines** | Sourced from **European Resuscitation Council (ERC 2025)** and **Indian Resuscitation Council (IRC)**. |
| **Simulation Transparency** | All mock volunteer alerts and hospital desk feeds are marked `[SIMULATED DEMO - MVP]`. |
| **Location Privacy** | Browser Geolocation API requires explicit consent; instant pause switch is provided. |

---

## 🎤 6. Ideathon Presentation Pack

### The 30-Second Pitch
> *"In a medical emergency, the first few minutes can be confusing and terrifying for bystanders. GoldenHour is a safety-first emergency response coordination platform designed for rural and semi-urban communities. It provides quick access to India's unified 112 emergency number, multilingual first-aid instructions in Kannada, Hindi, and English, emergency-contact sharing, and a demonstrable workflow for coordinating community volunteers and hospital pre-alerts. Unlike a basic ambulance locator, GoldenHour empowers bystanders to take verified, life-preserving action while professional medical help is on the way."*

### Suggested 5-Minute Demo Flow
1. **The Problem (40s)**: Bystander anxiety and language barriers during the ambulance wait.
2. **Emergency Home Screen (40s)**: Show prominent 112 dialer, language picker, and GPS location lock.
3. **Multilingual First-Aid (60s)**: Demonstrate CPR guide in Kannada/Hindi, audio metronome (110 BPM), and voice playback.
4. **Coordination Demo (60s)**: Show volunteer radar notification dispatch and hospital pre-alert trauma desk payload.
5. **Safety & Audit Metrics (60s)**: Show the persistent event timeline, time-to-first-action measurement, and simulation disclaimers.
