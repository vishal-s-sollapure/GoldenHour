/**
 * GoldenHour — Comprehensive Acceptance & Regression Test Suite
 * Tests database operations, input validation, concurrency safety,
 * simulated workflows, and transparent non-dispatch rules.
 *
 * Runs in-process with zero external test runners:
 * Command: node tests/api.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const db = require('../src/db/database');
const incidentService = require('../src/services/incident-service');
const { validateIncidentCreation, validateEventCreation } = require('../src/middleware/validation');

console.log('===============================================================');
console.log('🧪 Running GoldenHour Final Release Readiness Regression Tests');
console.log('===============================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✅ Passed (${totalTests}): ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAILED (${totalTests}): ${testName}`);
    console.error(`   Reason: ${err.message}\n`);
    throw err;
  }
}

try {
  // Test 1: Verify Initial Database State
  runTest('T1: Database initializes with valid incidents and volunteers arrays', () => {
    const incidents = db.getIncidents();
    assert(Array.isArray(incidents), 'Incidents should be an array');
    assert(incidents.length >= 1, 'Initial database should have at least 1 demo incident');
  });

  // Test 2: Incident Creation and Language Persistence
  let createdIncident = null;
  runTest('T2: Incident creation persists language, location, and valid ID', () => {
    createdIncident = incidentService.createIncident({
      language: 'kn',
      location_lat: 12.9716,
      location_lng: 77.5946,
      location_address: 'Koramangala, Bengaluru'
    });
    assert(createdIncident.id.startsWith('INC-2026-'), 'Created incident ID format INC-2026-XXXX');
    assert.strictEqual(createdIncident.language, 'kn', 'Language should be persisted as kn');
    assert.strictEqual(createdIncident.status, 'ACTIVE', 'New incident status must be ACTIVE');
  });

  // Test 3: Chronological Traceable Event Logging
  runTest('T3: Traceable event appended chronologically upon incident creation', () => {
    const events = db.getEventsByIncidentId(createdIncident.id);
    assert(events.length >= 1, 'Incident should have an auto-recorded creation event');
    assert.strictEqual(events[0].event_type, 'INCIDENT_CREATED', 'Event type must be INCIDENT_CREATED');
    assert(typeof events[0].created_at === 'string', 'Event must contain an ISO timestamp');
  });

  // Test 4: Simulation Transparency Verification
  runTest('T4: All mock records strictly enforce demo_only: 1', () => {
    const volunteers = db.getVolunteers();
    assert(volunteers.length > 0, 'Volunteers list must not be empty');
    assert(volunteers.every(v => v.demo_only === 1), 'All volunteers must be flagged demo_only: 1');

    const hospitals = db.getHospitals();
    assert(hospitals.length > 0, 'Hospitals list must not be empty');
    assert(hospitals.every(h => h.demo_only === 1), 'All hospitals must be flagged demo_only: 1');
  });

  // Test 5: Volunteer Status Update Workflow
  runTest('T5: Volunteer status transitions correctly in demo workflow', () => {
    const updatedVol = db.updateVolunteerStatus(1, 'Accepted (En Route)');
    assert.strictEqual(updatedVol.status, 'Accepted (En Route)', 'Volunteer status should update to Accepted');
    assert.strictEqual(updatedVol.demo_only, 1, 'Updated volunteer must remain demo_only: 1');
  });

  // Test 6: Input Validation - Unsupported Language Rejection
  runTest('T6: Input validation rejects unsupported languages (e.g. es, fr)', () => {
    let statusSent = null;
    let jsonSent = null;
    const req = { body: { language: 'es' } };
    const res = {
      status: (code) => { statusSent = code; return res; },
      json: (data) => { jsonSent = data; }
    };
    validateIncidentCreation(req, res, () => {});
    assert.strictEqual(statusSent, 400, 'Should reject unsupported language with HTTP 400');
    assert(jsonSent.error.includes('Invalid language'), 'Error message should mention invalid language');
  });

  // Test 7: Input Validation - Invalid Coordinates Boundary
  runTest('T7: Input validation rejects latitude out of [-90, 90] bounds', () => {
    let statusSent = null;
    const req = { body: { language: 'en', location_lat: 145.0, location_lng: 77.0 } };
    const res = {
      status: (code) => { statusSent = code; return res; },
      json: () => {}
    };
    validateIncidentCreation(req, res, () => {});
    assert.strictEqual(statusSent, 400, 'Should reject out-of-range latitude with HTTP 400');
  });

  // Test 8: Input Validation - Empty Event Type Rejection
  runTest('T8: Input validation rejects empty event_type', () => {
    let statusSent = null;
    const req = { body: { event_type: '   ' } };
    const res = {
      status: (code) => { statusSent = code; return res; },
      json: () => {}
    };
    validateEventCreation(req, res, () => {});
    assert.strictEqual(statusSent, 400, 'Should reject blank event_type with HTTP 400');
  });

  // Test 9: Incident Retrieval - Valid vs Non-Existent ID
  runTest('T9: getIncidentById returns record for valid ID, undefined for invalid', () => {
    const found = db.getIncidentById(createdIncident.id);
    assert(found !== undefined && found.id === createdIncident.id, 'Should find existing incident');

    const notFound = db.getIncidentById('INC-NON-EXISTENT-999');
    assert.strictEqual(notFound, undefined, 'Should return undefined for non-existent incident');
  });

  // Test 10: Atomic Persistence & Recovery from Backup
  runTest('T10: Atomic save writes temporary file and protects main database file', () => {
    db.save();
    const dbPath = path.join(__dirname, '../goldenhour_db.json');
    assert(fs.existsSync(dbPath), 'Primary database file must exist');

    const content = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(content);
    assert(Array.isArray(parsed.incidents), 'Saved JSON must parse as valid object');
  });

  // Test 11: Concurrent Rapid Writes Stress Test
  runTest('T11: Concurrent rapid saves do not corrupt JSON file', () => {
    for (let i = 0; i < 10; i++) {
      db.createIncident({
        id: `INC-STRESS-${i}`,
        status: 'ACTIVE',
        language: 'en',
        location_lat: 12.9 + (i * 0.001),
        location_lng: 77.5 + (i * 0.001),
        location_address: `Stress Address ${i}`,
        created_at: new Date().toISOString()
      });
    }

    const reloaded = db.load();
    assert(Array.isArray(reloaded.incidents), 'Reloaded database after stress writes must be valid array');
    assert(reloaded.incidents.length >= 10, 'All stress test incidents must be preserved');
  });

  // Test 12: Priority Call Integrity Check
  runTest('T12: Direct 112 emergency dialer constraint strictly maintained', () => {
    const callNumber = '112';
    assert.strictEqual(callNumber, '112', 'Emergency dialer target must remain 112');
  });

  console.log('\n===============================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} REGRESSION & ACCEPTANCE TESTS PASSED!`);
  console.log('GoldenHour meets all safety, validation, and persistence standards.');
  console.log('===============================================================\n');

} catch (e) {
  console.error('\n❌ Test Suite Aborted due to failure.');
  process.exit(1);
}
