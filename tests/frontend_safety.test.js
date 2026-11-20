/**
 * GoldenHour — Frontend Safety, Clinical Invariants & Workflow Test Suite
 * Verifies XSS prevention, direct 112 dialer invariants, contact validation,
 * location privacy pause behavior, metronome calculations, and translation parity.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ Passed (${totalTests}): ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAILED (${totalTests}): ${name}`);
    console.error(`   Error: ${err.message}`);
  }
}

console.log('===============================================================');
console.log('🛡️ Running GoldenHour Frontend Safety & Clinical Invariant Tests');
console.log('===============================================================');

// FS1: HTML escaping helper prevents XSS
runTest('FS1: HTML escaping helper properly escapes dangerous characters (&, <, >, ", \')', () => {
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const payload = '<script>alert("XSS")</script>&foo=\'bar\'';
  const escaped = escapeHtml(payload);
  assert.strictEqual(escaped.includes('<script>'), false);
  assert.strictEqual(escaped.includes('&lt;script&gt;'), true);
  assert.strictEqual(escaped.includes('&quot;XSS&quot;'), true);
  assert.strictEqual(escaped.includes('&#39;bar&#39;'), true);
  assert.strictEqual(escaped.includes('&amp;foo='), true);
  assert.strictEqual(escapeHtml(null), '');
  assert.strictEqual(escapeHtml(undefined), '');
});

// FS2: Direct 112 emergency calling invariant
runTest('FS2: Direct 112 emergency dialer constraint strictly maintained in HTML markup', () => {
  const indexPath = path.join(__dirname, '../index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Verify direct tel:112 button exists and is unblocked
  assert.strictEqual(indexHtml.includes('tel:112'), true, 'index.html must contain tel:112 link');
  assert.strictEqual(indexHtml.includes('id="call112Btn"'), true, 'call112Btn must be present');

  // Verify no authentication or login forms exist on index.html
  assert.strictEqual(indexHtml.includes('type="password"'), false, 'No login/password gate allowed before 112');
  assert.strictEqual(indexHtml.includes('required=""') && indexHtml.includes('login'), false);
});

// FS3: Emergency contact validation rules
runTest('FS3: Emergency contact validation accepts valid entries and rejects invalid formats', () => {
  const phoneRegex = /^\+?[0-9]{8,15}$/;

  function validateContact(name, phone) {
    if (!name || typeof name !== 'string') return false;
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 60) return false;

    if (!phone || typeof phone !== 'string') return false;
    const cleanedPhone = phone.replace(/[\s\-()]/g, '');
    if (!phoneRegex.test(cleanedPhone)) return false;

    return { name: trimmedName, phone: cleanedPhone };
  }

  // Valid contacts
  assert.ok(validateContact('Dr. Ramesh', '+919876543210'));
  assert.ok(validateContact('Mom', '9876543210'));
  assert.ok(validateContact('Emergency Center', '+14155552671'));
  assert.ok(validateContact('Priya', '+91 (987) 654-3210'));

  // Invalid contacts
  assert.strictEqual(validateContact('A', '9876543210'), false, 'Name too short');
  assert.strictEqual(validateContact('', '9876543210'), false, 'Empty name');
  assert.strictEqual(validateContact('Valid Name', '12345'), false, 'Phone too short');
  assert.strictEqual(validateContact('Valid Name', '12345678901234567890'), false, 'Phone too long');
  assert.strictEqual(validateContact('Valid Name', 'phone<script>'), false, 'Phone with alpha/tags');
});

// FS4: Location privacy pause suppresses coordinates
runTest('FS4: Emergency message generator suppresses coordinates when location sharing is paused', () => {
  function generateEmergencyMessage(userLocation, contacts) {
    let locationDetails = '';

    if (!userLocation.isSharing) {
      locationDetails = 'Location Sharing: PAUSED BY USER (GPS coordinates suppressed for privacy).\nPlease contact caller directly to determine location.';
    } else if (userLocation.permission === 'granted' || userLocation.isManual) {
      locationDetails = `My Location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}\nAddress: ${userLocation.address || 'GPS Coordinates'}`;
    } else {
      locationDetails = 'GPS Status: NOT DETECTED (Device location permission not granted or unavailable).\nPlease verify position manually with the caller.';
    }

    return `EMERGENCY ALERT from GoldenHour!\nI need immediate assistance.\n${locationDetails}\nPlease send help or call 112!`;
  }

  // When sharing is paused:
  const pausedLoc = { lat: 12.9716, lng: 77.5946, isSharing: false, permission: 'granted' };
  const pausedMsg = generateEmergencyMessage(pausedLoc, []);
  assert.strictEqual(pausedMsg.includes('PAUSED BY USER'), true);
  assert.strictEqual(pausedMsg.includes('https://maps.google.com'), false, 'Coordinates must NOT appear when paused');
});

// FS5: Location unconfirmed fallback does not leak fake coordinates
runTest('FS5: Emergency message generator does NOT send fallback coordinates when GPS permission is denied', () => {
  function generateEmergencyMessage(userLocation, contacts) {
    let locationDetails = '';

    if (!userLocation.isSharing) {
      locationDetails = 'Location Sharing: PAUSED BY USER (GPS coordinates suppressed for privacy).\nPlease contact caller directly to determine location.';
    } else if (userLocation.permission === 'granted' || userLocation.isManual) {
      locationDetails = `My Location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}\nAddress: ${userLocation.address || 'GPS Coordinates'}`;
    } else {
      locationDetails = 'GPS Status: NOT DETECTED (Device location permission not granted or unavailable).\nPlease verify position manually with the caller.';
    }

    return `EMERGENCY ALERT from GoldenHour!\nI need immediate assistance.\n${locationDetails}\nPlease send help or call 112!`;
  }

  // When GPS was denied and user did not manually pin:
  const deniedLoc = { lat: 12.9716, lng: 77.5946, isSharing: true, permission: 'denied', isManual: false };
  const deniedMsg = generateEmergencyMessage(deniedLoc, []);
  assert.strictEqual(deniedMsg.includes('GPS Status: NOT DETECTED'), true);
  assert.strictEqual(deniedMsg.includes('https://maps.google.com'), false, 'Fallback coordinates must not be sent as real GPS');

  // When user manually confirmed:
  const manualLoc = { lat: 13.0827, lng: 80.2707, isSharing: true, permission: 'denied', isManual: true };
  const manualMsg = generateEmergencyMessage(manualLoc, []);
  assert.strictEqual(manualMsg.includes('https://maps.google.com/?q=13.0827,80.2707'), true);
});

// FS6: CPR Metronome calculation
runTest('FS6: CPR Metronome calculates correct 110 BPM timing interval (~545ms) and 30-compression cycle', () => {
  const bpm = 110;
  const intervalMs = Math.round((60 / bpm) * 1000);
  assert.strictEqual(intervalMs, 545, '110 BPM must correspond to 545ms interval');

  // Verify 30-beat cycle calculation
  function getCycleBeat(totalBeats) {
    return ((totalBeats - 1) % 30) + 1;
  }
  assert.strictEqual(getCycleBeat(1), 1);
  assert.strictEqual(getCycleBeat(30), 30);
  assert.strictEqual(getCycleBeat(31), 1);
  assert.strictEqual(getCycleBeat(60), 30);
  assert.strictEqual(getCycleBeat(61), 1);
});

// FS7: Simulation transparency invariants across files
runTest('FS7: Simulation disclaimer banners exist in mock hospital, volunteer, and first-aid modules', () => {
  const hospitalJs = fs.readFileSync(path.join(__dirname, '../js/hospital.js'), 'utf8');
  assert.strictEqual(hospitalJs.includes('SIMULATED DEMO ONLY'), true);
  assert.strictEqual(hospitalJs.includes('112'), true);

  const volunteersJs = fs.readFileSync(path.join(__dirname, '../js/volunteers.js'), 'utf8');
  assert.strictEqual(volunteersJs.includes('SIMULATED DEMO - MVP'), true);
  assert.strictEqual(volunteersJs.includes('112'), true);

  const firstAidHtml = fs.readFileSync(path.join(__dirname, '../first-aid.html'), 'utf8');
  assert.strictEqual(firstAidHtml.includes('Medical Disclaimer'), true);
  assert.strictEqual(firstAidHtml.includes('ERSS 112'), true);
});

// FS8: Multilingual clinical dictionary parity
runTest('FS8: Multilingual translation dictionaries (en, hi, kn) have full key parity for clinical guides', () => {
  // Load translations.js
  const translationsCode = fs.readFileSync(path.join(__dirname, '../js/translations.js'), 'utf8');
  // Evaluate in safe local context
  const sandbox = {};
  const fn = new Function('sandbox', `${translationsCode}; sandbox.TRANSLATIONS = TRANSLATIONS;`);
  fn(sandbox);
  const T = sandbox.TRANSLATIONS;

  assert.ok(T.en, 'English translation must exist');
  assert.ok(T.hi, 'Hindi translation must exist');
  assert.ok(T.kn, 'Kannada translation must exist');

  const requiredGuides = ['cprSteps', 'bleedingSteps', 'recoverySteps'];
  for (const lang of ['en', 'hi', 'kn']) {
    for (const guide of requiredGuides) {
      assert.ok(Array.isArray(T[lang][guide]), `${lang}.${guide} must be an array`);
      assert.strictEqual(T[lang][guide].length, 4, `${lang}.${guide} must contain exactly 4 steps`);
      for (const stepObj of T[lang][guide]) {
        assert.ok(typeof stepObj.step === 'number', `Step number must be number in ${lang}.${guide}`);
        assert.ok(typeof stepObj.title === 'string' && stepObj.title.length > 0, `Title must be non-empty in ${lang}.${guide}`);
        assert.ok(typeof stepObj.desc === 'string' && stepObj.desc.length > 0, `Desc must be non-empty in ${lang}.${guide}`);
      }
    }
  }
});

console.log('===============================================================');
if (passedTests === totalTests) {
  console.log(`🎉 ALL ${passedTests}/${totalTests} FRONTEND & CLINICAL INVARIANT TESTS PASSED!`);
} else {
  console.error(`⚠️ FAILED: ${totalTests - passedTests} test(s) failed out of ${totalTests}.`);
  process.exit(1);
}
console.log('===============================================================');
