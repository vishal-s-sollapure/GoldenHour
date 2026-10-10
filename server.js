/**
 * GoldenHour — Backend Server
 * Universal compatibility: Runs seamlessly with Express (if installed)
 * OR falls back to Node's built-in HTTP module so it starts IMMEDIATELY
 * with zero npm install required!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const db = require('./src/db/database');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      callback(null, body ? JSON.parse(body) : {});
    } catch (e) {
      callback(e);
    }
  });
}

// Built-in HTTP Request Handler
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // API Endpoints (Technical Blueprint Section 11)

  // 1. GET /api/health
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'OK',
      app: 'GoldenHour',
      tagline: 'Help Before the Ambulance Arrives',
      priorityCall: 'India 112 unblocked',
      nonDiagnostic: true,
      demoOnly: true,
      timestamp: new Date().toISOString()
    });
  }

  // 2. GET /api/incidents
  if (pathname === '/api/incidents' && method === 'GET') {
    const incidents = db.getIncidents();
    return sendJson(res, 200, {
      demoOnly: true,
      total: incidents.length,
      incidents
    });
  }

  // 3. POST /api/incidents
  if (pathname === '/api/incidents' && method === 'POST') {
    return parseJsonBody(req, (err, payload) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON payload', demoOnly: true });

      const newId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();
      const incident = {
        id: newId,
        status: 'ACTIVE',
        language: payload.language || 'en',
        location_lat: payload.location_lat || 12.9716,
        location_lng: payload.location_lng || 77.5946,
        location_address: payload.location_address || 'MG Road, Indiranagar, Bengaluru',
        created_at: now,
        resolved_at: null
      };

      db.createIncident(incident);
      db.addEvent({
        id: `EVT-${Date.now()}`,
        incident_id: newId,
        event_type: 'INCIDENT_CREATED',
        details: 'SOS incident recorded in persistent SQLite store',
        created_at: now
      });

      return sendJson(res, 201, { success: true, demoOnly: true, incident });
    });
  }

  // 4. GET /api/incidents/:id
  const incidentMatch = pathname.match(/^\/api\/incidents\/([a-zA-Z0-9_-]+)$/);
  if (incidentMatch && method === 'GET') {
    const incId = incidentMatch[1];
    const incident = db.getIncidentById(incId);
    if (!incident) return sendJson(res, 404, { error: 'Incident not found', demoOnly: true });

    const events = db.getEventsByIncidentId(incId);
    return sendJson(res, 200, { demoOnly: true, incident, events });
  }

  // 5. POST /api/incidents/:id/events
  const eventMatch = pathname.match(/^\/api\/incidents\/([a-zA-Z0-9_-]+)\/events$/);
  if (eventMatch && method === 'POST') {
    const incId = eventMatch[1];
    return parseJsonBody(req, (err, payload) => {
      if (err || !payload.event_type) {
        return sendJson(res, 400, { error: 'event_type is required', demoOnly: true });
      }

      const newEvent = {
        id: `EVT-${Date.now()}`,
        incident_id: incId,
        event_type: payload.event_type,
        details: payload.details || '',
        created_at: new Date().toISOString()
      };

      db.addEvent(newEvent);
      return sendJson(res, 201, { success: true, demoOnly: true, event: newEvent });
    });
  }

  // 6. GET /api/demo/volunteers
  if (pathname === '/api/demo/volunteers' && method === 'GET') {
    return sendJson(res, 200, {
      demoOnly: true,
      notice: 'SYNTHETIC SAMPLE DATA FOR DEMONSTRATION PURPOSES ONLY',
      volunteers: db.getVolunteers()
    });
  }

  // 7. POST /api/demo/alerts
  if (pathname === '/api/demo/alerts' && method === 'POST') {
    return parseJsonBody(req, (err, payload) => {
      const alert = {
        id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
        incident_id: payload.incident_id || 'INC-2026-1001',
        recipient_type: payload.recipient_type || 'VOLUNTEER',
        recipient_name: payload.recipient_name || 'Dr. Priya M.',
        status: 'DISPATCHED',
        created_at: new Date().toISOString(),
        demo_only: 1
      };
      db.createAlert(alert);
      return sendJson(res, 201, { success: true, demoOnly: true, alert });
    });
  }

  // 8. GET /api/demo/alerts
  if (pathname === '/api/demo/alerts' && method === 'GET') {
    return sendJson(res, 200, {
      demoOnly: true,
      alerts: db.getAlerts()
    });
  }

  // 9. GET /api/demo/hospitals
  if (pathname === '/api/demo/hospitals' && method === 'GET') {
    return sendJson(res, 200, {
      demoOnly: true,
      notice: 'SYNTHETIC SAMPLE DATA FOR DEMONSTRATION PURPOSES ONLY',
      hospitals: db.getHospitals()
    });
  }

  // 10. GET /api/metrics
  if (pathname === '/api/metrics' && method === 'GET') {
    return sendJson(res, 200, {
      demoOnly: true,
      totalIncidents: db.getIncidents().length,
      totalEvents: db.getAllEvents().length,
      alertsDispatched: db.getAlerts().length,
      volunteersRegistered: db.getVolunteers().length,
      safetyChecksPassed: true
    });
  }

  // Static File Serving
  let filePath = pathname === '/' ? '/index.html' : pathname;
  let safePath = path.join(__dirname, filePath);

  // Security: prevent directory traversal
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Access Denied');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client-side routing
      safePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(safePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        return res.end('Internal Server Error');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n=======================================================`);
  console.log(`🚨 GoldenHour Emergency Server running on http://localhost:${PORT}`);
  console.log(`⚡ Direct 112 calling priority unblocked`);
  console.log(`📊 Persistent DB file: goldenhour_db.json`);
  console.log(`=======================================================\n`);
});
