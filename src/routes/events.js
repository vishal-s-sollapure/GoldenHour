/**
 * GoldenHour — Incident Events API Routes
 * Records verifiable chronological actions taken during an emergency.
 */

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { validateEventCreation } = require('../middleware/validation');

// GET /api/incidents/:id/events - List events for a specific incident
router.get('/:id/events', (req, res) => {
  const events = db.getEventsByIncidentId(req.params.id);
  res.json({
    demoOnly: true,
    incident_id: req.params.id,
    events
  });
});

// POST /api/incidents/:id/events - Record a new action/event
router.post('/:id/events', validateEventCreation, (req, res) => {
  const incident = db.getIncidentById(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found', demoOnly: true });
  }

  const { event_type, details } = req.body;
  const newEvent = {
    id: `EVT-${Date.now()}`,
    incident_id: req.params.id,
    event_type: event_type.trim(),
    details: details || '',
    created_at: new Date().toISOString()
  };

  db.addEvent(newEvent);

  res.status(201).json({
    success: true,
    demoOnly: true,
    event: newEvent
  });
});

module.exports = router;
