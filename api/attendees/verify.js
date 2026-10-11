import { attendeeAllowlist, normalizeName } from '../../attendee-data.mjs';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    try {
      const { name } = await request.json();
      const normalized = normalizeName(name);
      const canonicalName = normalized
        ? attendeeAllowlist.find(value => normalizeName(value) === normalized) || null
        : null;
      return canonicalName
        ? json({ valid: true, canonicalName })
        : json({ valid: false }, 403);
    } catch {
      return json({ valid: false, error: 'Invalid verification request' }, 400);
    }
  },
};
