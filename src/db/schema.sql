-- GoldenHour SQLite Relational Database Schema
-- Safety principle: Synthetic demo data is clearly isolated with demo_only flags.
-- Timestamps are stored in UTC ISO 8601 format.

-- 1. Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'RESOLVED', 'CANCELLED')),
  language TEXT NOT NULL DEFAULT 'en',
  location_lat REAL,
  location_lng REAL,
  location_address TEXT,
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

-- 2. Incident Events Table (Traceable event history)
CREATE TABLE IF NOT EXISTS incident_events (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);

-- 3. Synthetic Volunteers Directory (Demo Only)
CREATE TABLE IF NOT EXISTS demo_volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name TEXT NOT NULL,
  training_status TEXT NOT NULL,
  distance TEXT,
  eta TEXT,
  status TEXT NOT NULL DEFAULT 'Available',
  demo_only INTEGER NOT NULL DEFAULT 1
);

-- 4. Simulated Alerts Table
CREATE TABLE IF NOT EXISTS demo_alerts (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  recipient_type TEXT NOT NULL CHECK(recipient_type IN ('VOLUNTEER', 'HOSPITAL')),
  recipient_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DISPATCHED',
  created_at TEXT NOT NULL,
  demo_only INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);

-- 5. Synthetic Hospitals Directory (Demo Only)
CREATE TABLE IF NOT EXISTS demo_hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  display_address TEXT NOT NULL,
  trauma_level TEXT,
  demo_only INTEGER NOT NULL DEFAULT 1
);

-- Seed Initial Synthetic Data for Demos
INSERT OR IGNORE INTO demo_volunteers (id, display_name, training_status, distance, eta, status, demo_only) VALUES
  (1, 'Dr. Priya M.', 'MD / CPR & BLS Certified', '350m', '3 mins', 'Available', 1),
  (2, 'Rahul Sharma', 'Red Cross First Responder', '600m', '5 mins', 'Available', 1),
  (3, 'Ananya Rao', 'Paramedic Student', '850m', '7 mins', 'Available', 1),
  (4, 'Vikram Singh', 'Basic First Aid Trained', '1.2km', '12 mins', 'Available', 1);

INSERT OR IGNORE INTO demo_hospitals (id, name, display_address, trauma_level, demo_only) VALUES
  (1, 'Manipal Hospital Emergency Desk', 'HAL Old Airport Rd, Bengaluru', 'Level 1 Trauma Center', 1),
  (2, 'St. John’s Medical College Hospital', 'Koramangala, Bengaluru', 'Level 1 Emergency Dept', 1);
