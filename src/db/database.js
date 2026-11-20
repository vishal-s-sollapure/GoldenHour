/**
 * GoldenHour — Database Layer
 * Provides persistent storage for incidents, event logs, demo volunteers, and hospital alerts.
 * Features atomic file replacement (.tmp -> renameSync) and backup recovery (.bak).
 * Configurable via process.env.DB_FILE or constructor for complete test isolation.
 */

const fs = require('fs');
const path = require('path');

function resolveDbPath(customPath) {
  if (customPath) return path.resolve(customPath);
  if (process.env.DB_FILE) return path.resolve(process.env.DB_FILE);
  return path.join(__dirname, '../../goldenhour_db.json');
}

// Default initial database state with synthetic demo records
const defaultState = {
  incidents: [
    {
      id: 'INC-2026-1001',
      status: 'ACTIVE',
      language: 'en',
      location_lat: 12.9716,
      location_lng: 77.5946,
      location_address: 'MG Road, Indiranagar, Bengaluru',
      created_at: new Date().toISOString(),
      resolved_at: null
    }
  ],
  incident_events: [
    {
      id: 'EVT-1001-1',
      incident_id: 'INC-2026-1001',
      event_type: 'INCIDENT_CREATED',
      details: 'Emergency SOS initiated via GoldenHour app',
      created_at: new Date().toISOString()
    },
    {
      id: 'EVT-1001-2',
      incident_id: 'INC-2026-1001',
      event_type: 'FIRST_AID_STARTED',
      details: 'CPR 110 BPM Metronome started by bystander',
      created_at: new Date().toISOString()
    }
  ],
  demo_volunteers: [
    { id: 1, display_name: 'Dr. Priya M.', training_status: 'MD / CPR & BLS Certified', distance: '350m', eta: '3 mins', status: 'Available', demo_only: 1 },
    { id: 2, display_name: 'Rahul Sharma', training_status: 'Red Cross First Responder', distance: '600m', eta: '5 mins', status: 'Available', demo_only: 1 },
    { id: 3, display_name: 'Ananya Rao', training_status: 'Paramedic Student', distance: '850m', eta: '7 mins', status: 'Available', demo_only: 1 },
    { id: 4, display_name: 'Vikram Singh', training_status: 'Basic First Aid Trained', distance: '1.2km', eta: '12 mins', status: 'Available', demo_only: 1 }
  ],
  demo_alerts: [
    {
      id: 'ALT-501',
      incident_id: 'INC-2026-1001',
      recipient_type: 'VOLUNTEER',
      recipient_name: 'Dr. Priya M.',
      status: 'DISPATCHED',
      created_at: new Date().toISOString(),
      demo_only: 1
    },
    {
      id: 'ALT-502',
      incident_id: 'INC-2026-1001',
      recipient_type: 'HOSPITAL',
      recipient_name: 'Manipal Hospital Emergency Desk',
      status: 'DISPATCHED',
      created_at: new Date().toISOString(),
      demo_only: 1
    }
  ],
  demo_hospitals: [
    { id: 1, name: 'Manipal Hospital Emergency Desk', display_address: 'HAL Old Airport Rd, Bengaluru', trauma_level: 'Level 1 Trauma Center', demo_only: 1 },
    { id: 2, name: 'St. John’s Medical College Hospital', display_address: 'Koramangala, Bengaluru', trauma_level: 'Level 1 Emergency Dept', demo_only: 1 }
  ]
};

class GoldenHourDB {
  constructor(customPath = null) {
    this.dbFile = resolveDbPath(customPath);
    this.bakFile = `${this.dbFile}.bak`;
    this.data = this.load();
  }

  load() {
    // 1. Try reading primary database file
    try {
      if (fs.existsSync(this.dbFile)) {
        const raw = fs.readFileSync(this.dbFile, 'utf8');
        if (raw && raw.trim().length > 0) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.incidents)) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn(`[GoldenHourDB] Primary file (${this.dbFile}) unreadable or corrupted: ${err.message}. Checking backup...`);
    }

    // 2. Try recovering from backup file if primary failed
    try {
      if (fs.existsSync(this.bakFile)) {
        const rawBak = fs.readFileSync(this.bakFile, 'utf8');
        if (rawBak && rawBak.trim().length > 0) {
          const recovered = JSON.parse(rawBak);
          if (recovered && Array.isArray(recovered.incidents)) {
            console.log(`[GoldenHourDB] Successfully recovered database from backup: ${this.bakFile}`);
            this.save(recovered);
            return recovered;
          }
        }
      }
    } catch (bakErr) {
      console.warn(`[GoldenHourDB] Backup file also unreadable (${bakErr.message}), falling back to clean default state.`);
    }

    // 3. Fall back to clean initial state
    const freshState = JSON.parse(JSON.stringify(defaultState));
    this.save(freshState);
    return freshState;
  }

  save(dataToSave) {
    const data = dataToSave || this.data;
    const tempFile = `${this.dbFile}.tmp.${Date.now()}.${Math.floor(Math.random() * 1000)}`;

    try {
      const jsonString = JSON.stringify(data, null, 2);

      // Write complete payload to temp file first
      fs.writeFileSync(tempFile, jsonString, 'utf8');

      // Create backup of existing file only if it is non-empty (> 10 bytes)
      if (fs.existsSync(this.dbFile)) {
        try {
          const stat = fs.statSync(this.dbFile);
          if (stat.size > 10) {
            fs.copyFileSync(this.dbFile, this.bakFile);
          }
        } catch (_) {}
      }

      // Atomically replace DB file with Windows EPERM / contention fallback
      try {
        fs.renameSync(tempFile, this.dbFile);
      } catch (renameErr) {
        if (renameErr.code === 'EPERM' || renameErr.code === 'EBUSY') {
          fs.copyFileSync(tempFile, this.dbFile);
          try { fs.unlinkSync(tempFile); } catch (_) {}
        } else {
          throw renameErr;
        }
      }
    } catch (err) {
      console.error(`[GoldenHourDB] Failed to write database file atomically (${this.dbFile}):`, err.message);
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch (_) {}
    }
  }

  // Incidents Management
  getIncidents() {
    return this.data.incidents;
  }

  getIncidentById(id) {
    return this.data.incidents.find(i => i.id === id);
  }

  createIncident(incident) {
    if (!incident || typeof incident !== 'object' || !incident.id) {
      throw new Error('Invalid incident: Incident must be an object with an ID');
    }

    // Duplicate Prevention (Idempotency)
    const existing = this.data.incidents.find(i => i.id === incident.id);
    if (existing) {
      return existing;
    }

    this.data.incidents.unshift(incident);
    this.save();
    return incident;
  }

  // Event Logging (Chronological)
  getEventsByIncidentId(incidentId) {
    return this.data.incident_events
      .filter(e => e.incident_id === incidentId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getAllEvents() {
    return this.data.incident_events;
  }

  addEvent(event) {
    if (!event || typeof event !== 'object' || !event.event_type) {
      throw new Error('Invalid event: Event must be an object with an event_type');
    }

    const newEvent = {
      id: event.id || `EVT-${Date.now()}`,
      incident_id: event.incident_id,
      event_type: event.event_type,
      details: event.details || '',
      created_at: event.created_at || new Date().toISOString()
    };

    this.data.incident_events.unshift(newEvent);
    this.save();
    return newEvent;
  }

  // Demo Volunteers
  getVolunteers() {
    return this.data.demo_volunteers;
  }

  updateVolunteerStatus(id, status) {
    const vol = this.data.demo_volunteers.find(v => v.id === id);
    if (vol) {
      vol.status = status;
      this.save();
    }
    return vol;
  }

  // Demo Alerts
  getAlerts() {
    return this.data.demo_alerts;
  }

  createAlert(alert) {
    if (!alert || typeof alert !== 'object' || !alert.id) {
      throw new Error('Invalid alert: Alert must be an object with an ID');
    }
    this.data.demo_alerts.unshift(alert);
    this.save();
    return alert;
  }

  updateAlertStatus(alertId, status) {
    const alert = this.data.demo_alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      this.save();
    }
    return alert;
  }

  // Demo Hospitals
  getHospitals() {
    return this.data.demo_hospitals;
  }
}

const defaultInstance = new GoldenHourDB();
defaultInstance.GoldenHourDB = GoldenHourDB;
module.exports = defaultInstance;
