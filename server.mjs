import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { attendeeAllowlist, normalizeName } from './attendee-data.mjs';

const siteRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.env.PORT || 8765);
const host = process.env.HOST || (process.env.PORT ? '0.0.0.0' : '127.0.0.1');

// Temporary authoritative allowlist: this project has no connected database.
// Replace loadAttendeeNames() with the existing database query when one is configured.


async function loadAttendeeNames() {
  // Database integration point: return canonical attendee names from the connected DB here.
  return attendeeAllowlist;
}



function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 2048) throw new Error('Request body too large');
  }
  return JSON.parse(body || '{}');
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (url.pathname === '/api/health' && request.method === 'GET') {
    return sendJson(response, 200, { ok: true, source: 'local-attendee-allowlist', databaseConnected: false });
  }

  if (url.pathname === '/api/attendees' && request.method === 'GET') {
    const query = normalizeName(url.searchParams.get('q') || '');
    const names = await loadAttendeeNames();
    const matches = query
      ? names.filter(name => normalizeName(name).includes(query)).slice(0, 8)
      : [];
    const exact = names.find(name => normalizeName(name) === query) || null;
    return sendJson(response, 200, { matches, exactName: exact });
  }

  if (url.pathname === '/api/attendees/verify' && request.method === 'POST') {
    try {
      const { name } = await readJson(request);
      const normalized = normalizeName(name);
      const names = await loadAttendeeNames();
      const canonicalName = normalized ? names.find(value => normalizeName(value) === normalized) : null;
      if (!canonicalName) return sendJson(response, 403, { valid: false });
      return sendJson(response, 200, { valid: true, canonicalName });
    } catch {
      return sendJson(response, 400, { valid: false, error: 'Invalid verification request' });
    }
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return sendJson(response, 405, { error: 'Method not allowed' });
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  if (relativePath !== 'index.html' && !relativePath.startsWith('assets/')) {
    response.writeHead(404).end('Not found');
    return;
  }
  const filePath = resolve(siteRoot, relativePath);
  if (!filePath.startsWith(siteRoot + sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Back to Base certificate site listening on ${host}:${port}`);
});
