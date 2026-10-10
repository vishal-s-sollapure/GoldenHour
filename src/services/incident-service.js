/**
 * GoldenHour — Incident Business Logic Service
 * Orchestrates incident creation, audit event dispatch, and coordination payloads.
 */

const db = require('../db/database');

class IncidentService {
  createIncident(data) {
    const id = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const incident = {
      id,
      status: 'ACTIVE',
      language: data.language || 'en',
      location_lat: data.location_lat || 12.9716,
      location_lng: data.location_lng || 77.5946,
      location_address: data.location_address || 'MG Road, Indiranagar, Bengaluru',
      created_at: now,
      resolved_at: null
    };

    db.createIncident(incident);

    // Record initial traceable event
    db.addEvent({
      id: `EVT-${Date.now()}`,
      incident_id: id,
      event_type: 'INCIDENT_CREATED',
      details: 'Emergency SOS incident opened by user',
      created_at: now
    });

    return incident;
  }

  getIncidentWithHistory(id) {
    const incident = db.getIncidentById(id);
    if (!incident) return null;
    const events = db.getEventsByIncidentId(id);
    return { incident, events };
  }

  logEvent(incidentId, eventType, details) {
    return db.addEvent({
      id: `EVT-${Date.now()}`,
      incident_id: incidentId,
      event_type: eventType,
      details: details || '',
      created_at: new Date().toISOString()
    });
  }
}

module.exports = new IncidentService();
