# Back to Base — Founder–Investor Connect Certificate Generator

A certificate generator with an animated cinematic intro, live certificate preview, attendee name verification, and PNG, JPG, and PDF exports.

## Run locally

Requires Node.js 18 or newer. No package installation is needed.

```powershell
node server.mjs
```

Then open <http://127.0.0.1:8765>.

## Attendee verification

The verification API runs in `server.mjs`. This project currently uses the supplied attendee allowlist; it is not connected to a database. The `loadAttendeeNames()` function is the integration point for a future authoritative database query.

## Files

- `index.html` — website UI, certificate renderer, and export actions
- `server.mjs` — local HTTP server and server-side attendee verification API
- `assets/` — certificate artwork, background artwork, intro image, and supplied reference image
