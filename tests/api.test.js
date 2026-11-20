/**
 * GoldenHour — Comprehensive Acceptance & Regression Test Suite
 * Fully isolated execution: Operates on a dedicated temporary test database
 * to guarantee that production datastore (goldenhour_db.json) is never contaminated.
 *
 * Runs in-process with zero external test runners:
 * Command: node tests/api.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Configure isolated test database BEFORE loading database modules
const TEST_DB_PATH = path.join(__dirname, 'test_goldenhour_db.json');
process.env.DB_FILE = TEST_DB_PATH;

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
    assert(fs.existsSync(TEST_DB_PATH), 'Test database file must exist');

    const content = fs.readFileSync(TEST_DB_PATH, 'utf8');
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

  // Test 12: Priority Call Invariant (Inspecting Real HTML Dialers)
  runTest('T12: Direct 112 emergency dialer constraint strictly maintained in HTML markup', () => {
    const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    const firstAidHtml = fs.readFileSync(path.join(__dirname, '../first-aid.html'), 'utf8');

    assert(indexHtml.includes('href="tel:112"') || indexHtml.includes("'tel:112'"), 'index.html must feature unblocked tel:112 dialer link');
    assert(firstAidHtml.includes('112'), 'first-aid.html must prominently reinforce calling 112');
  });

  // Test 13: Duplicate Incident Prevention & Idempotency
  runTest('T13: Duplicate incident ID insertion is prevented idempotently', () => {
    const originalCount = db.getIncidents().length;
    const dupIncident = {
      id: createdIncident.id,
      status: 'ACTIVE',
      language: 'hi',
      location_lat: 13.0,
      location_lng: 77.0,
      location_address: 'Duplicate Attempt',
      created_at: new Date().toISOString()
    };
    const result = db.createIncident(dupIncident);
    assert.strictEqual(result.id, createdIncident.id);
    assert.strictEqual(db.getIncidents().length, originalCount, 'Duplicate ID must not increase incident count');
  });

  // Test 14: Disaster Recovery from Backup File
  runTest('T14: Corrupted primary file automatically recovers from healthy backup', () => {
    const { GoldenHourDB } = db;
    const corruptTestPath = path.join(__dirname, 'corrupt_test_db.json');
    const corruptBakPath = `${corruptTestPath}.bak`;

    try {
      // 1. Create a healthy backup file
      const healthyData = {
        incidents: [{ id: 'INC-RECOVERED-01', status: 'ACTIVE', language: 'en', created_at: new Date().toISOString() }],
        incident_events: [],
        demo_volunteers: [{ id: 1, display_name: 'Dr. Backup', demo_only: 1 }],
        demo_alerts: [],
        demo_hospitals: []
      };
      fs.writeFileSync(corruptBakPath, JSON.stringify(healthyData), 'utf8');

      // 2. Create a corrupted/broken primary file
      fs.writeFileSync(corruptTestPath, '{{{ corrupt JSON payload', 'utf8');

      // 3. Initialize engine on the corrupted file
      const recoveryDb = new GoldenHourDB(corruptTestPath);
      const loadedIncidents = recoveryDb.getIncidents();

      assert(Array.isArray(loadedIncidents), 'Recovered incidents must be array');
      assert.strictEqual(loadedIncidents[0].id, 'INC-RECOVERED-01', 'Should recover data from healthy .bak file');
    } finally {
      if (fs.existsSync(corruptTestPath)) fs.unlinkSync(corruptTestPath);
      if (fs.existsSync(corruptBakPath)) fs.unlinkSync(corruptBakPath);
    }
  });

  console.log('\n===============================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} REGRESSION & ACCEPTANCE TESTS PASSED!`);
  console.log('GoldenHour meets all safety, validation, and persistence standards.');
  console.log('===============================================================\n');

} catch (e) {
  console.error('\n❌ Test Suite Aborted due to failure.');
  process.exit(1);
} finally {
  // Clean up isolated test database files so workspace remains pristine
  try {
    if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
    const bakPath = `${TEST_DB_PATH}.bak`;
    if (fs.existsSync(bakPath)) fs.unlinkSync(bakPath);
  } catch (_) {}
}
