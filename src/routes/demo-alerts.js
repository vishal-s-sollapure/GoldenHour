/**
 * GoldenHour — Demo Coordination & Alerts API Routes
 * Manages synthetic volunteers, simulated alerts, and demo hospital records.
 * Explicitly tagged with demoOnly: true to prevent false claims of live dispatch.
 */

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/demo/volunteers - List synthetic nearby volunteers
router.get('/volunteers', (req, res) => {
  res.json({
    demoOnly: true,
    notice: 'SYNTHETIC SAMPLE DATA FOR DEMONSTRATION PURPOSES ONLY',
    volunteers: db.getVolunteers()
  });
});

// POST /api/demo/alerts - Generate a simulated volunteer/hospital alert
router.post('/alerts', (req, res) => {
  const { incident_id, recipient_type, recipient_name } = req.body || {};

  if (!recipient_type || !['VOLUNTEER', 'HOSPITAL'].includes(recipient_type)) {
    return res.status(400).json({
      error: 'recipient_type must be either VOLUNTEER or HOSPITAL',
      demoOnly: true
    });
  }

  const alertId = `ALT-${Math.floor(100 + Math.random() * 900)}`;
  const newAlert = {
    id: alertId,
    incident_id: incident_id || 'INC-2026-DEMO',
    recipient_type,
    recipient_name: recipient_name || (recipient_type === 'VOLUNTEER' ? 'Community Responder' : 'Trauma Desk'),
    status: 'DISPATCHED',
    created_at: new Date().toISOString(),
    demo_only: 1
  };

  db.createAlert(newAlert);

  res.status(201).json({
    success: true,
    demoOnly: true,
    notice: 'SIMULATED ALERT GENERATED — NOT A LIVE MEDICAL DISPATCH',
    alert: newAlert
  });
});

// GET /api/demo/alerts - Display simulated alert statuses
router.get('/alerts', (req, res) => {
  res.json({
    demoOnly: true,
    alerts: db.getAlerts()
  });
});

// GET /api/demo/hospitals - List synthetic hospital records
router.get('/hospitals', (req, res) => {
  res.json({
    demoOnly: true,
    notice: 'SYNTHETIC SAMPLE DATA FOR DEMONSTRATION PURPOSES ONLY',
    hospitals: db.getHospitals()
  });
});

module.exports = router;
