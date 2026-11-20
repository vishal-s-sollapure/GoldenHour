/**
 * GoldenHour — Security & API Hardening Acceptance Test Suite
 * In-process direct execution: Zero socket bindings required (works reliably across all sandboxes/OS).
 * Tests:
 * 1. Baseline Security Headers (nosniff, DENY, etc.)
 * 2. CORS Preflight & Origin matching
 * 3. 100 KB Payload Limiter (HTTP 413)
 * 4. Malformed JSON handling (HTTP 400)
 * 5. Non-existent API route handling (JSON 404, never index.html)
 * 6. Method enforcement (HTTP 405 Method Not Allowed)
 * 7. Information Disclosure Prevention (server.js, db.json, package.json blocked)
 * 8. Directory Traversal Guard (CWE-22)
 * 9. Production Guard on /api/test-run
 * 10. Input sanitization against Stored XSS
 */

const assert = require('assert');
const { EventEmitter } = require('events');
const { handleRequest, sanitizeString } = require('../server.js');

console.log('===============================================================');
console.log('🔒 Running GoldenHour Security & API Hardening Test Suite');
console.log('===============================================================\n');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`✅ Passed (${total}): ${name}`);
      passed++;
    })
    .catch(err => {
      console.error(`❌ FAILED (${total}): ${name}`);
      console.error(`   ${err.message}\n`);
      throw err;
    });
}

function mockHttpCall({ method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = {};
    for (const [k, v] of Object.entries(headers)) {
      req.headers[k.toLowerCase()] = v;
    }
    req.socket = { remoteAddress: '127.0.0.1' };
    req.pause = () => {};
    req.resume = () => {};

    let statusCode = 200;
    const resHeaders = {};
    let responseBody = '';

    const res = {
      writeHead: (status, h) => {
        statusCode = status;
        if (h) {
          for (const [hk, hv] of Object.entries(h)) {
            resHeaders[hk.toLowerCase()] = hv;
          }
        }
      },
      setHeader: (k, v) => {
        resHeaders[k.toLowerCase()] = v;
      },
      end: (data) => {
        if (data) responseBody += data.toString();
        resolve({
          statusCode,
          headers: resHeaders,
          body: responseBody
        });
      }
    };

    handleRequest(req, res);

    if (body !== null && body !== undefined) {
      if (typeof body === 'string') {
        req.emit('data', Buffer.from(body));
      } else {
        req.emit('data', body);
      }
    }
    req.emit('end');
  });
}

async function runAllSecurityTests() {
  // S1: Baseline Security Headers
  await test('S1: Security headers present on API responses', async () => {
    const res = await mockHttpCall({ url: '/api/health' });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    assert.strictEqual(res.headers['x-frame-options'], 'DENY');
    assert.strictEqual(res.headers['referrer-policy'], 'strict-origin-when-cross-origin');
  });

  // S2: CORS Preflight Handler
  await test('S2: CORS OPTIONS Preflight returns 204 with methods and origin', async () => {
    const res = await mockHttpCall({
      url: '/api/incidents',
      method: 'OPTIONS',
      headers: { 'Origin': 'https://vishal-s-sollapure.github.io' }
    });
    assert.strictEqual(res.statusCode, 204);
    assert(res.headers['access-control-allow-origin']);
    assert(res.headers['access-control-allow-methods'].includes('GET, POST'));
    assert.strictEqual(res.headers['access-control-max-age'], '86400');
  });

  // S3: Payload Size Limiter (HTTP 413)
  await test('S3: Request payloads > 100KB rejected with HTTP 413 Payload Too Large', async () => {
    const largeAddress = 'A'.repeat(105 * 1024); // 105 KB string
    const payload = JSON.stringify({ language: 'en', location_address: largeAddress });
    const res = await mockHttpCall({
      url: '/api/incidents',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    assert.strictEqual(res.statusCode, 413, `Expected 413, got ${res.statusCode}`);
    const json = JSON.parse(res.body);
    assert(json.error.includes('Payload Too Large'));
  });

  // S4: Malformed JSON Handling (HTTP 400)
  await test('S4: Malformed JSON request bodies rejected with HTTP 400', async () => {
    const malformedPayload = '{"language": "en", location: broken}';
    const res = await mockHttpCall({
      url: '/api/incidents',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: malformedPayload
    });
    assert.strictEqual(res.statusCode, 400);
    const json = JSON.parse(res.body);
    assert(json.error.includes('Malformed JSON') || json.error.includes('Invalid JSON'));
  });

  // S5: API 404 Isolation (Does NOT serve index.html)
  await test('S5: Non-existent /api/* routes return JSON 404, never index.html', async () => {
    const res = await mockHttpCall({ url: '/api/non-existent-endpoint' });
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.headers['content-type'], 'application/json; charset=UTF-8');
    const json = JSON.parse(res.body);
    assert(json.error.includes('not found'));
  });

  // S6: HTTP Method Enforcement (HTTP 405)
  await test('S6: Unsupported HTTP methods on API routes return HTTP 405 Method Not Allowed', async () => {
    const res = await mockHttpCall({
      url: '/api/health',
      method: 'POST',
      body: JSON.stringify({ test: 1 })
    });
    assert.strictEqual(res.statusCode, 405);
    const json = JSON.parse(res.body);
    assert(json.error.includes('Method Not Allowed'));
  });

  // S7: Information Disclosure Prevention (server.js blocked)
  await test('S7: Direct access to server.js is blocked with HTTP 403', async () => {
    const res = await mockHttpCall({ url: '/server.js' });
    assert.strictEqual(res.statusCode, 403);
    assert(res.body.includes('Access Denied'));
  });

  // S8: Information Disclosure Prevention (goldenhour_db.json blocked)
  await test('S8: Direct access to database file goldenhour_db.json is blocked with HTTP 403', async () => {
    const res = await mockHttpCall({ url: '/goldenhour_db.json' });
    assert.strictEqual(res.statusCode, 403);
    assert(res.body.includes('Access Denied'));
  });

  // S9: Information Disclosure Prevention (package.json blocked)
  await test('S9: Direct access to package.json is blocked with HTTP 403', async () => {
    const res = await mockHttpCall({ url: '/package.json' });
    assert.strictEqual(res.statusCode, 403);
    assert(res.body.includes('Access Denied'));
  });

  // S10: Directory Traversal Guard (CWE-22)
  await test('S10: Directory traversal attempts (../) blocked with HTTP 403', async () => {
    const res = await mockHttpCall({ url: '/../../../Windows/win.ini' });
    assert.strictEqual(res.statusCode, 403);
  });

  // S11: Input Sanitization Helper against XSS
  await test('S11: Input sanitizer strips direct HTML tag brackets to prevent stored XSS', () => {
    const dirty = '<script>alert("xss")</script>123 MG Road, Bengaluru';
    const clean = sanitizeString(dirty, 200);
    assert(!clean.includes('<script>'), 'Script tag opening must be stripped');
    assert(!clean.includes('</script>'), 'Script tag closing must be stripped');
    assert(clean.includes('123 MG Road'), 'Safe address text must be preserved');
  });

  // S12: Production Environment Guard on /api/test-run
  await test('S12: /api/test-run endpoint is blocked in production (NODE_ENV=production)', async () => {
    const prevEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      const res = await mockHttpCall({ url: '/api/test-run' });
      assert.strictEqual(res.statusCode, 403);
      const json = JSON.parse(res.body);
      assert(json.error.includes('disabled in production'));
    } finally {
      process.env.NODE_ENV = prevEnv;
    }
  });

  console.log('\n===============================================================');
  console.log(`🎉 ALL ${passed}/${total} SECURITY & HARDENING TESTS PASSED!`);
  console.log('GoldenHour backend verified against CORS, DoS, XSS, and disclosure risks.');
  console.log('===============================================================\n');
}

runAllSecurityTests().catch(err => {
  console.error('\n❌ Security Test Suite Failed:', err.message);
  process.exit(1);
});
