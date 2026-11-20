/**
 * GoldenHour — Security & API Hardening Acceptance Test Suite
 * Tests:
 * 1. CORS Preflight & Origin reflection
 * 2. Security Headers (nosniff, DENY, etc.)
 * 3. 100 KB Payload Limiter (HTTP 413)
 * 4. Malformed JSON handling (HTTP 400)
 * 5. Method enforcement & API 404/405 isolation
 * 6. Information Disclosure Prevention (server.js, db.json, package.json protected)
 * 7. Path Traversal Guard (CWE-22)
 * 8. Production Guard on /api/test-run
 * 9. Input sanitization against Stored XSS
 */

const assert = require('assert');
const http = require('http');
const { handleRequest, sanitizeString, getCorsOrigin } = require('../server.js');

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

// Helper to make local in-process HTTP requests to test server
function makeRequest(server, options, postData) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const reqOptions = {
      hostname: '127.0.0.1',
      port: addr.port,
      path: options.path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runAllSecurityTests() {
  const testServer = http.createServer(handleRequest);
  await new Promise(resolve => testServer.listen(0, '127.0.0.1', resolve));

  try {
    // S1: Baseline Security Headers
    await test('S1: Security headers present on API responses', async () => {
      const res = await makeRequest(testServer, { path: '/api/health' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
      assert.strictEqual(res.headers['x-frame-options'], 'DENY');
      assert.strictEqual(res.headers['referrer-policy'], 'strict-origin-when-cross-origin');
    });

    // S2: CORS Preflight Handler
    await test('S2: CORS OPTIONS Preflight returns 204 with methods and origin', async () => {
      const res = await makeRequest(testServer, {
        path: '/api/incidents',
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
      const res = await makeRequest(testServer, {
        path: '/api/incidents',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, payload);
      assert.strictEqual(res.statusCode, 413, `Expected 413, got ${res.statusCode}`);
      const json = JSON.parse(res.body);
      assert(json.error.includes('Payload Too Large'));
    });

    // S4: Malformed JSON Handling (HTTP 400)
    await test('S4: Malformed JSON request bodies rejected with HTTP 400', async () => {
      const malformedPayload = '{"language": "en", location: broken}';
      const res = await makeRequest(testServer, {
        path: '/api/incidents',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, malformedPayload);
      assert.strictEqual(res.statusCode, 400);
      const json = JSON.parse(res.body);
      assert(json.error.includes('Malformed JSON') || json.error.includes('Invalid JSON'));
    });

    // S5: API 404 Isolation (Does NOT serve index.html)
    await test('S5: Non-existent /api/* routes return JSON 404, never index.html', async () => {
      const res = await makeRequest(testServer, { path: '/api/non-existent-endpoint' });
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.headers['content-type'], 'application/json; charset=UTF-8');
      const json = JSON.parse(res.body);
      assert(json.error.includes('not found'));
    });

    // S6: HTTP Method Enforcement (HTTP 405)
    await test('S6: Unsupported HTTP methods on API routes return HTTP 405 Method Not Allowed', async () => {
      const res = await makeRequest(testServer, {
        path: '/api/health',
        method: 'POST'
      }, JSON.stringify({ test: 1 }));
      assert.strictEqual(res.statusCode, 405);
      const json = JSON.parse(res.body);
      assert(json.error.includes('Method Not Allowed'));
    });

    // S7: Information Disclosure Prevention (server.js blocked)
    await test('S7: Direct access to server.js is blocked with HTTP 403', async () => {
      const res = await makeRequest(testServer, { path: '/server.js' });
      assert.strictEqual(res.statusCode, 403);
      assert(res.body.includes('Access Denied'));
    });

    // S8: Information Disclosure Prevention (goldenhour_db.json blocked)
    await test('S8: Direct access to database file goldenhour_db.json is blocked with HTTP 403', async () => {
      const res = await makeRequest(testServer, { path: '/goldenhour_db.json' });
      assert.strictEqual(res.statusCode, 403);
      assert(res.body.includes('Access Denied'));
    });

    // S9: Information Disclosure Prevention (package.json blocked)
    await test('S9: Direct access to package.json is blocked with HTTP 403', async () => {
      const res = await makeRequest(testServer, { path: '/package.json' });
      assert.strictEqual(res.statusCode, 403);
      assert(res.body.includes('Access Denied'));
    });

    // S10: Directory Traversal Guard (CWE-22)
    await test('S10: Directory traversal attempts (../) blocked with HTTP 403', async () => {
      const res = await makeRequest(testServer, { path: '/../../../Windows/win.ini' });
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
        const res = await makeRequest(testServer, { path: '/api/test-run' });
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

  } finally {
    await new Promise(resolve => testServer.close(resolve));
  }
}

runAllSecurityTests().catch(err => {
  console.error('\n❌ Security Test Suite Failed:', err.message);
  process.exit(1);
});
