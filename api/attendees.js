import { attendeeAllowlist, normalizeName } from '../attendee-data.mjs';

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
  fetch(request) {
    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const query = normalizeName(new URL(request.url).searchParams.get('q') || '');
    const matches = query
      ? attendeeAllowlist.filter(name => normalizeName(name).includes(query)).slice(0, 8)
      : [];
    const exactName = attendeeAllowlist.find(name => normalizeName(name) === query) || null;

    return json({ matches, exactName });
  },
};
