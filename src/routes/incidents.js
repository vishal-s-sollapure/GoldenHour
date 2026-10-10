/**
 * GoldenHour — Incidents API Routes
 * Handlers for incident creation, retrieval, and status tracking.
 */

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { validateIncidentCreation } = require('../middleware/validation');

// GET /api/incidents - List incidents
router.get('/', (req, res) => {
  const incidents = db.getIncidents();
  res.json({
    demoOnly: true,
    total: incidents.length,
    incidents
  });
});

// GET /api/incidents/:id - Get incident by ID with associated events
router.get('/:id', (req, res) => {
  const incident = db.getIncidentById(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found', demoOnly: true });
  }

  const events = db.getEventsByIncidentId(req.params.id);
  res.json({
    demoOnly: true,
    incident,
    events
  });
});

// POST /api/incidents - Create a new demo incident
router.post('/', validateIncidentCreation, (req, res) => {
  const { language, location_lat, location_lng, location_address } = req.body || {};

  const id = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newIncident = {
    id,
    status: 'ACTIVE',
    language: language || 'en',
    location_lat: location_lat || 12.9716,
    location_lng: location_lng || 77.5946,
    location_address: location_address || 'Bengaluru, Karnataka, India',
    created_at: now,
    resolved_at: null
  };

  db.createIncident(newIncident);

  // Automatically record initial event
  db.addEvent({
    id: `EVT-${Date.now()}`,
    incident_id: id,
    event_type: 'INCIDENT_CREATED',
    details: 'SOS incident opened by user',
    created_at: now
  });

  res.status(201).json({
    success: true,
    demoOnly: true,
    incident: newIncident
  });
});

module.exports = router;
