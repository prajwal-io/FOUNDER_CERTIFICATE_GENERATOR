export default {
  fetch() {
    return new Response(JSON.stringify({ ok: true, source: 'local-attendee-allowlist', databaseConnected: false }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
};
