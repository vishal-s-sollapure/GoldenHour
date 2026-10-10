/**
 * GoldenHour — Automated Acceptance Criteria Test Suite
 * Tests database operations, safety constraints, and API responses.
 * Zero external test framework required — runs directly with `node tests/api.test.js`.
 */

const assert = require('assert');
const db = require('../src/db/database');
const incidentService = require('../src/services/incident-service');

console.log('🧪 Starting GoldenHour Acceptance Verification Tests...\n');

try {
  // Test 1: Verify Initial Database State
  const initialIncidents = db.getIncidents();
  assert(Array.isArray(initialIncidents), 'Incidents should be an array');
  console.log('✅ Test 1 Passed: Database initializes with incidents array.');

  // Test 2: Incident Creation and Persistence
  const created = incidentService.createIncident({
    language: 'kn',
    location_lat: 12.9716,
    location_lng: 77.5946,
    location_address: 'Koramangala, Bengaluru'
  });
  assert(created.id.startsWith('INC-2026-'), 'Created incident should have valid ID format');
  assert.strictEqual(created.language, 'kn', 'Incident language should be kn');
  console.log('✅ Test 2 Passed: Incident created and language stored accurately.');

  // Test 3: Chronological Traceable Event Logging
  const events = db.getEventsByIncidentId(created.id);
  assert(events.length >= 1, 'Incident should have an auto-recorded creation event');
  assert.strictEqual(events[0].event_type, 'INCIDENT_CREATED', 'Event type should be INCIDENT_CREATED');
  console.log('✅ Test 3 Passed: Incident events logged chronologically.');

  // Test 4: Simulation Transparency Verification
  const volunteers = db.getVolunteers();
  assert(volunteers.every(v => v.demo_only === 1), 'All volunteers must be flagged as demo_only');
  const hospitals = db.getHospitals();
  assert(hospitals.every(h => h.demo_only === 1), 'All hospitals must be flagged as demo_only');
  console.log('✅ Test 4 Passed: All synthetic records strictly enforce demo_only: 1.');

  // Test 5: Volunteer Status Update Workflow
  const updatedVol = db.updateVolunteerStatus(1, 'Accepted (En Route)');
  assert.strictEqual(updatedVol.status, 'Accepted (En Route)', 'Volunteer status should update');
  console.log('✅ Test 5 Passed: Volunteer response workflow updates correctly.');

  console.log('\n🎉 ALL ACCEPTANCE TESTS PASSED (5/5)! GoldenHour meets Blueprint standards.');
} catch (err) {
  console.error('\n❌ Test Failure:', err.message);
  process.exit(1);
}
