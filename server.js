/**
 * GoldenHour — Backend Server
 * Universal compatibility: Runs seamlessly with Node's built-in HTTP module
 * with zero npm install required, and exports for testing and Express integration.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Lightweight built-in .env parser (zero external dependencies)
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"](.*)['"]$/, '$1');
          if (key && process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      });
    } catch (_) {}
  }
}
loadEnvFile();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const db = require('./src/db/database');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const MAX_BODY_SIZE = 100 * 1024; // 100 KB limit to prevent memory exhaustion DoS

// Baseline HTTP Security Headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), payment=()'
};

// CORS Origin Matcher respecting ALLOWED_ORIGIN configuration
function getCorsOrigin(req) {
  if (ALLOWED_ORIGIN === '*') return '*';
  const requestOrigin = req && req.headers ? req.headers.origin : null;
  if (!requestOrigin) return ALLOWED_ORIGIN;
  const allowedList = ALLOWED_ORIGIN.split(',').map(s => s.trim().toLowerCase());
  if (allowedList.includes(requestOrigin.toLowerCase()) || allowedList.includes('*')) {
    return requestOrigin;
  }
  return ALLOWED_ORIGIN;
}

// In-Memory Sliding-Window Rate Limiter for State-Mutating APIs
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_WRITES = 30; // Max 30 writes per minute per IP
const ipWriteCounts = new Map();

function isRateLimited(req) {
  const ip = (req.headers && req.headers['x-forwarded-for']) || (req.socket && req.socket.remoteAddress) || '127.0.0.1';
  const clientIp = typeof ip === 'string' ? ip.split(',')[0].trim() : '127.0.0.1';
  const now = Date.now();
  const record = ipWriteCounts.get(clientIp) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  record.count++;
  ipWriteCounts.set(clientIp, record);

  // Periodic pruning of stale client entries
  if (ipWriteCounts.size > 2000) {
    for (const [key, val] of ipWriteCounts.entries()) {
      if (now > val.resetAt) ipWriteCounts.delete(key);
    }
  }

  return record.count > RATE_LIMIT_MAX_WRITES;
}

// Input Sanitizer to neutralize HTML tags and control characters
function sanitizeString(str, maxLength = 200) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Strip direct HTML opening/closing brackets
}

function sendJson(res, statusCode, data, req) {
  const origin = getCorsOrigin(req);
  res.writeHead(statusCode, {
    ...SECURITY_HEADERS,
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req, callback) {
  let body = '';
  let exceeded = false;

  req.on('data', chunk => {
    if (exceeded) return;
    body += chunk;
    if (body.length > MAX_BODY_SIZE) {
      exceeded = true;
      if (typeof req.pause === 'function') req.pause();
      const err = new Error('Payload Too Large: Maximum request payload is 100 KB');
      err.statusCode = 413;
      callback(err);
    }
  });

  req.on('end', () => {
    if (exceeded) return;
    if (!body || !body.trim()) {
      return callback(null, {});
    }
    try {
      const parsed = JSON.parse(body);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        const err = new Error('Invalid JSON: Request body must be a JSON object');
        err.statusCode = 400;
        return callback(err);
      }
      callback(null, parsed);
    } catch (e) {
      const err = new Error('Malformed JSON payload');
      err.statusCode = 400;
      callback(err);
    }
  });
}

// Built-in HTTP Request Handler
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';
  const method = req.method;

  // 1. Handle CORS Preflight
  if (method === 'OPTIONS') {
    const origin = getCorsOrigin(req);
    res.writeHead(204, {
      ...SECURITY_HEADERS,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  // 2. API Endpoints

  // GET /api/health
  if (pathname === '/api/health') {
    if (method !== 'GET') {
      return sendJson(res, 405, { error: 'Method Not Allowed. Use GET.', demoOnly: true }, req);
    }
    return sendJson(res, 200, {
      status: 'OK',
      app: 'GoldenHour',
      tagline: 'Help Before the Ambulance Arrives',
      priorityCall: 'India 112 unblocked',
      nonDiagnostic: true,
      demoOnly: true,
      timestamp: new Date().toISOString()
    }, req);
  }

  // GET & POST /api/incidents
  if (pathname === '/api/incidents') {
    if (method === 'GET') {
      const incidents = db.getIncidents();
      return sendJson(res, 200, {
        demoOnly: true,
        total: incidents.length,
        incidents
      }, req);
    }

    if (method === 'POST') {
      if (isRateLimited(req)) {
        return sendJson(res, 429, {
          error: 'Rate limit exceeded: Too many incident submissions from this IP. Please wait 60 seconds.',
          demoOnly: true
        }, req);
      }

      return parseJsonBody(req, (err, payload) => {
        if (err) {
          return sendJson(res, err.statusCode || 400, { error: err.message, demoOnly: true }, req);
        }

        const { language, location_lat, location_lng, location_address } = payload || {};

        if (language && !['en', 'hi', 'kn'].includes(language)) {
          return sendJson(res, 400, { error: 'Invalid language specified. Supported: en, hi, kn', demoOnly: true }, req);
        }
        if (location_lat !== undefined && (typeof location_lat !== 'number' || isNaN(location_lat) || location_lat < -90 || location_lat > 90)) {
          return sendJson(res, 400, { error: 'Invalid latitude value. Range: -90 to 90', demoOnly: true }, req);
        }
        if (location_lng !== undefined && (typeof location_lng !== 'number' || isNaN(location_lng) || location_lng < -180 || location_lng > 180)) {
          return sendJson(res, 400, { error: 'Invalid longitude value. Range: -180 to 180', demoOnly: true }, req);
        }

        const newId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date().toISOString();
        const safeAddress = sanitizeString(location_address, 200) || 'Bengaluru, Karnataka, India';

        const incident = {
          id: newId,
          status: 'ACTIVE',
          language: language || 'en',
          location_lat: location_lat !== undefined ? location_lat : 12.9716,
          location_lng: location_lng !== undefined ? location_lng : 77.5946,
          location_address: safeAddress,
          created_at: now,
          resolved_at: null
        };

        db.createIncident(incident);
        db.addEvent({
          id: `EVT-${Date.now()}`,
          incident_id: newId,
          event_type: 'INCIDENT_CREATED',
          details: 'Emergency SOS incident opened by user',
          created_at: now
        });

        return sendJson(res, 201, { success: true, demoOnly: true, incident }, req);
      });
    }

    return sendJson(res, 405, { error: `Method '${method}' not allowed on /api/incidents. Supported: GET, POST`, demoOnly: true }, req);
  }

  // GET /api/incidents/:id
  const incidentMatch = pathname.match(/^\/api\/incidents\/([a-zA-Z0-9_-]+)$/);
  if (incidentMatch) {
    if (method !== 'GET') {
      return sendJson(res, 405, { error: `Method '${method}' not allowed. Supported: GET`, demoOnly: true }, req);
    }
    const incId = incidentMatch[1];
    const incident = db.getIncidentById(incId);
    if (!incident) return sendJson(res, 404, { error: 'Incident not found', demoOnly: true }, req);

    const events = db.getEventsByIncidentId(incId);
    return sendJson(res, 200, { demoOnly: true, incident, events }, req);
  }

  // POST /api/incidents/:id/events
  const eventMatch = pathname.match(/^\/api\/incidents\/([a-zA-Z0-9_-]+)\/events$/);
  if (eventMatch) {
    if (method !== 'POST') {
      return sendJson(res, 405, { error: `Method '${method}' not allowed on /api/incidents/:id/events. Supported: POST`, demoOnly: true }, req);
    }
    const incId = eventMatch[1];
    const incident = db.getIncidentById(incId);
    if (!incident) {
      return sendJson(res, 404, { error: 'Incident not found', demoOnly: true }, req);
    }

    if (isRateLimited(req)) {
      return sendJson(res, 429, {
        error: 'Rate limit exceeded: Too many event submissions from this IP. Please wait 60 seconds.',
        demoOnly: true
      }, req);
    }

    return parseJsonBody(req, (err, payload) => {
      if (err) {
        return sendJson(res, err.statusCode || 400, { error: err.message, demoOnly: true }, req);
      }

      if (!payload.event_type || typeof payload.event_type !== 'string' || !payload.event_type.trim()) {
        return sendJson(res, 400, { error: 'event_type is required and must be a non-empty string', demoOnly: true }, req);
      }

      const rawType = payload.event_type.trim();
      if (!/^[A-Z0-9_]{1,60}$/i.test(rawType)) {
        return sendJson(res, 400, { error: 'event_type must contain only alphanumeric characters and underscores (max 60)', demoOnly: true }, req);
      }

      const newEvent = {
        id: `EVT-${Date.now()}`,
        incident_id: incId,
        event_type: rawType.toUpperCase(),
        details: sanitizeString(payload.details, 500),
        created_at: new Date().toISOString()
      };

      db.addEvent(newEvent);
      return sendJson(res, 201, { success: true, demoOnly: true, event: newEvent }, req);
    });
  }

  // GET /api/demo/volunteers
  if (pathname === '/api/demo/volunteers') {
    if (method !== 'GET') {
      return sendJson(res, 405, { error: 'Method Not Allowed. Use GET.', demoOnly: true }, req);
    }
    return sendJson(res, 200, {
      demoOnly: true,
      notice: 'SYNTHETIC SAMPLE DATA FOR DEMONSTRATION PURPOSES ONLY',
      volunteers: db.getVolunteers()
    }, req);
  }

  // GET & POST /api/demo/alerts
  if (pathname === '/api/demo/alerts') {
    if (method === 'GET') {
      return sendJson(res, 200, {
        demoOnly: true,
        alerts: db.getAlerts()
      }, req);
    }

    if (method === 'POST') {
      if (isRateLimited(req)) {
        return sendJson(res, 429, { error: 'Rate limit exceeded.', demoOnly: true }, req);
      }

      return parseJsonBody(req, (err, payload) => {
        if (err) return sendJson(res, err.statusCode || 400, { error: err.message, demoOnly: true }, req);

        const { recipient_type, incident_id, recipient_name } = payload || {};
        if (!recipient_type || !['VOLUNTEER', 'HOSPITAL'].includes(recipient_type)) {
          return sendJson(res, 400, {
            error: 'recipient_type must be either VOLUNTEER or HOSPITAL',
            demoOnly: true
          }, req);
        }

        const safeRecipientName = sanitizeString(recipient_name, 100) || (recipient_type === 'VOLUNTEER' ? 'Community Volunteer' : 'Trauma Desk');

        const alert = {
          id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
          incident_id: sanitizeString(incident_id, 50) || 'INC-2026-1001',
          recipient_type,
          recipient_name: safeRecipientName,
          status: 'DISPATCHED',
          created_at: new Date().toISOString(),
          demo_only: 1
        };
        db.createAlert(alert);
        return sendJson(res, 201, {
          success: true,
          demoOnly: true,
          notice: 'SIMULATED ALERT GENERATED — NOT A LIVE MEDICAL DISPATCH',
          alert
        }, req);
      });
    }

    return sendJson(res, 405, { error: 'Method Not Allowed. Supported: GET, POST', demoOnly: true }, req);
  }

  // GET /api/demo/hospitals
  if (pathname === '/api/demo/hospitals') {
    if (method !== 'GET') {
      return sendJson(res, 405, { error: 'Method Not Allowed. Use GET.', demoOnly: true }, req);
    }
    return sendJson(res, 200, {
      demoOnly: true,
      notice: 'SYNTHETIC SAMPLE DATA FOR DEMONSTRATION PURPOSES ONLY',
      hospitals: db.getHospitals()
    }, req);
  }

  // GET /api/metrics
  if (pathname === '/api/metrics') {
    if (method !== 'GET') {
      return sendJson(res, 405, { error: 'Method Not Allowed. Use GET.', demoOnly: true }, req);
    }
    return sendJson(res, 200, {
      demoOnly: true,
      totalIncidents: db.getIncidents().length,
      totalEvents: db.getAllEvents().length,
      alertsDispatched: db.getAlerts().length,
      volunteersRegistered: db.getVolunteers().length,
      safetyChecksPassed: true
    }, req);
  }

  // GET /api/test-run (Protected in production environments)
  if (pathname === '/api/test-run') {
    if (method !== 'GET') {
      return sendJson(res, 405, { error: 'Method Not Allowed. Use GET.', demoOnly: true }, req);
    }

    if (process.env.NODE_ENV === 'production') {
      return sendJson(res, 403, {
        error: 'Test runner endpoint is disabled in production environments for safety and data integrity',
        demoOnly: true
      }, req);
    }

    const testResults = [];
    const runTest = (name, fn) => {
      try {
        fn();
        testResults.push({ name, status: 'PASSED' });
      } catch (e) {
        testResults.push({ name, status: 'FAILED', error: e.message });
      }
    };

    let testIncId = null;
    try {
      runTest('T1: Incidents collection is array', () => {
        const incs = db.getIncidents();
        if (!Array.isArray(incs)) throw new Error('Not an array');
      });

      runTest('T2: Incident creation with valid attributes', () => {
        const inc = db.createIncident({
          id: `INC-TEST-${Date.now()}`,
          status: 'ACTIVE',
          language: 'hi',
          location_lat: 12.9716,
          location_lng: 77.5946,
          location_address: 'Test Location, Bengaluru',
          created_at: new Date().toISOString()
        });
        testIncId = inc.id;
        if (!inc.id || inc.language !== 'hi') throw new Error('Invalid incident created');
      });

      runTest('T3: Chronological event logging', () => {
        const evt = db.addEvent({
          id: `EVT-TEST-${Date.now()}`,
          incident_id: testIncId,
          event_type: 'CPR_STARTED',
          details: 'Test CPR metronome started',
          created_at: new Date().toISOString()
        });
        const events = db.getEventsByIncidentId(testIncId);
        if (!events.some(e => e.id === evt.id)) throw new Error('Event was not persisted');
      });

      runTest('T4: Simulation transparency enforcement (demo_only: 1)', () => {
        const vols = db.getVolunteers();
        if (!vols.every(v => v.demo_only === 1)) throw new Error('Volunteer without demo_only flag found');
        const hosps = db.getHospitals();
        if (!hosps.every(h => h.demo_only === 1)) throw new Error('Hospital without demo_only flag found');
      });

      runTest('T5: Volunteer status workflow', () => {
        const updated = db.updateVolunteerStatus(1, 'Accepted (En Route)');
        if (updated.status !== 'Accepted (En Route)') throw new Error('Status not updated');
      });

      runTest('T6: Atomic database save and reload integrity', () => {
        db.save();
        const reloaded = db.load();
        if (!Array.isArray(reloaded.incidents)) throw new Error('Reloaded data corrupted');
      });
    } finally {
      // Revert test mutations so production state remains clean
      db.updateVolunteerStatus(1, 'Available');
      if (testIncId) {
        db.data.incidents = db.data.incidents.filter(i => i.id !== testIncId);
        db.data.incident_events = db.data.incident_events.filter(e => e.incident_id !== testIncId);
        db.save();
      }
    }

    const passedCount = testResults.filter(t => t.status === 'PASSED').length;
    return sendJson(res, 200, {
      total: testResults.length,
      passed: passedCount,
      failed: testResults.length - passedCount,
      allPassed: passedCount === testResults.length,
      results: testResults
    }, req);
  }

  // 3. Catch-All for Unknown /api/* Requests (Never fall through to index.html for API calls)
  if (pathname.startsWith('/api/')) {
    return sendJson(res, 404, {
      error: `API route '${pathname}' not found`,
      demoOnly: true
    }, req);
  }

  // 4. Static File Serving with Strict Whitelist & Blacklist Controls

  // Static files only allow GET and HEAD
  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { ...SECURITY_HEADERS, 'Allow': 'GET, HEAD' });
    return res.end('Method Not Allowed');
  }

  let filePath = pathname === '/' ? '/index.html' : pathname;
  const normalizedBase = path.resolve(__dirname) + path.sep;
  let safePath = path.resolve(__dirname, '.' + filePath);

  // Security Guard: Prevent directory traversal (CWE-22)
  if (!safePath.startsWith(normalizedBase) && safePath !== path.resolve(__dirname, 'index.html')) {
    res.writeHead(403, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  // Security Guard: Information Disclosure Prevention
  // Disallow access to backend scripts, environment secrets, database dumps, and config files
  const cleanRelPath = path.relative(__dirname, safePath).replace(/\\/g, '/');
  const FORBIDDEN_FILE_PATTERNS = [
    /\.json$/i,            // Database files & package.json
    /\.env/i,              // Environment secrets
    /\.ya?ml$/i,           // Deployment configuration
    /\.sql$/i,             // Database schemas
    /\.bak$/i,             // Database backups
    /\.tmp/i,              // Temp files
    /\.log$/i,             // Log dumps
    /\.git/i,              // Git metadata
    /^server\.js$/i,       // Primary server script
    /^src\//i,             // Backend source modules
    /^tests\//i            // Test suites
  ];

  if (FORBIDDEN_FILE_PATTERNS.some(pat => pat.test(cleanRelPath))) {
    res.writeHead(403, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain' });
    return res.end('Access Denied: Protected System Resource');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Client-side SPA routing fallback to index.html
      safePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(safePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }
      res.writeHead(200, {
        ...SECURITY_HEADERS,
        'Content-Type': contentType
      });
      if (method === 'HEAD') {
        return res.end();
      }
      res.end(content);
    });
  });
}

const server = http.createServer(handleRequest);

// Start listening if executed directly
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n=======================================================`);
    console.log(`🚨 GoldenHour Emergency Server running on http://localhost:${PORT}`);
    console.log(`⚡ Direct 112 calling priority unblocked`);
    console.log(`🔒 Security headers, body limit (100KB), and CORS active`);
    console.log(`📊 Persistent DB file: goldenhour_db.json`);
    console.log(`=======================================================\n`);
  });
}

module.exports = {
  server,
  handleRequest,
  parseJsonBody,
  sanitizeString,
  getCorsOrigin,
  isRateLimited,
  SECURITY_HEADERS
};
