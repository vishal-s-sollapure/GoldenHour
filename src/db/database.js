/**
 * GoldenHour — Database Layer
 * Provides persistent storage for incidents, event logs, demo volunteers, and hospital alerts.
 * Features automatic file persistence in goldenhour_db.json so that test data
 * survives server restarts, meeting the Blueprint acceptance criteria.
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../goldenhour_db.json');

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
  constructor() {
    this.data = this.load();
  }

  load() {
    // 1. Try reading primary database file
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Primary database file corrupted or unreadable. Checking backup...', err.message);
    }

    // 2. Try recovering from backup file if primary failed
    const bakFile = `${DB_FILE}.bak`;
    try {
      if (fs.existsSync(bakFile)) {
        const rawBak = fs.readFileSync(bakFile, 'utf8');
        const recovered = JSON.parse(rawBak);
        console.log('Successfully recovered database from backup file.');
        this.save(recovered);
        return recovered;
      }
    } catch (bakErr) {
      console.warn('Backup file also unreadable, falling back to defaults:', bakErr.message);
    }

    // 3. Fall back to clean default state
    this.save(defaultState);
    return JSON.parse(JSON.stringify(defaultState));
  }

  save(dataToSave) {
    const data = dataToSave || this.data;
    const tempFile = `${DB_FILE}.tmp.${Date.now()}.${Math.floor(Math.random() * 1000)}`;
    const bakFile = `${DB_FILE}.bak`;

    try {
      const jsonString = JSON.stringify(data, null, 2);
      // Write to temp file first
      fs.writeFileSync(tempFile, jsonString, 'utf8');

      // Create backup of existing file before replacement
      if (fs.existsSync(DB_FILE)) {
        try {
          fs.copyFileSync(DB_FILE, bakFile);
        } catch (_) {}
      }

      // Atomically replace DB file
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file atomically:', err.message);
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch (_) {}
    }
  }

  // Incidents
  getIncidents() {
    return this.data.incidents;
  }

  getIncidentById(id) {
    return this.data.incidents.find(i => i.id === id);
  }

  createIncident(incident) {
    this.data.incidents.unshift(incident);
    this.save();
    return incident;
  }

  // Events
  getEventsByIncidentId(incidentId) {
    return this.data.incident_events.filter(e => e.incident_id === incidentId);
  }

  getAllEvents() {
    return this.data.incident_events;
  }

  addEvent(event) {
    this.data.incident_events.unshift(event);
    this.save();
    return event;
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

module.exports = new GoldenHourDB();
