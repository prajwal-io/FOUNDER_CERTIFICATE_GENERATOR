# Back to Base — Founder–Investor Connect Certificate Generator

A certificate generator with an animated cinematic intro, live certificate preview, attendee name verification, and PNG, JPG, and PDF exports.

## Run locally

Requires Node.js 18 or newer. No external packages are required.

```sh
npm start
```

Then open <http://127.0.0.1:8765>.

## Hosting

The repository supports both a Node web service and Vercel. Vercel automatically builds the functions in `api/` as same-origin endpoints, so attendee autocomplete and verification work in the deployed website. The Node server provides the same API when running locally or on a Node host.

## Attendee verification

The API uses the supplied 47-name attendee allowlist in `attendee-data.mjs`; it is not connected to a database. Both deployment paths validate against this allowlist before returning suggestions or authorizing certificate generation and export. A future authoritative database can replace the data source in that module and the shared Node server integration.

## Files

- `index.html` — website UI, certificate renderer, and export actions
- `server.mjs` — Node HTTP server and attendee verification API
- `attendee-data.mjs` — canonical attendee allowlist and name normalization
- `api/` — Vercel serverless endpoints for autocomplete, verification, and health checks
- `assets/` — certificate artwork, background artwork, intro image, and supplied reference image
