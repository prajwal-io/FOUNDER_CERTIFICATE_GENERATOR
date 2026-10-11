# Back to Base — Founder–Investor Connect Certificate Generator

A certificate generator with an animated cinematic intro, live certificate preview, attendee name verification, and PNG, JPG, and PDF exports.

## Run locally

Requires Node.js 18 or newer. No external packages are required.

```sh
npm start
```

Then open <http://127.0.0.1:8765>.

## Hosting

Run this as a Node web service, not as static-only GitHub Pages: the name autocomplete and certificate verification call the same-origin `/api/attendees` endpoints. The server reads the host-provided `PORT` and binds to `0.0.0.0` when `PORT` is set. You can override this with `HOST` if needed.

## Attendee verification

The verification API runs in `server.mjs`. This project currently uses the supplied attendee allowlist; it is not connected to a database. The `loadAttendeeNames()` function is the integration point for a future authoritative database query.

## Files

- `index.html` — website UI, certificate renderer, and export actions
- `server.mjs` — HTTP server and server-side attendee verification API
- `assets/` — certificate artwork, background artwork, intro image, and supplied reference image
