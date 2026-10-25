# Contributing to KINETIK

## Requirements

- Node.js 24 (Vite 8 requires Node.js 20.19 or newer; CI uses Node 24).
- npm.
- Chromium installed through Playwright for browser-level checks.

## Local checks

```bash
npm install
npm run check
npx playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4173
```

In another terminal, set the local root URL explicitly because GitHub Pages uses a project subpath:

```bash
PREVIEW_URL=http://127.0.0.1:4173/ npm run test:browser
```

The Playwright smoke suite creates screenshots under `artifacts/`; this directory is ignored by Git. It checks the production preview rather than Vite's development server.

## Review expectations

- Preserve the concept disclaimer. Do not invent a real gym address, member counts, testimonials, live schedule, pricing, bookings, or coaching capabilities.
- Keep the 3D equipment models responsive, keyboard-friendly around the controls, respectful of reduced motion, and inexpensive to render away from the viewport.
- Keep app data local unless a backend is deliberately designed and documented.
- Run `npm run check` and the browser smoke tests after touching app behavior, metadata, or deployment configuration.
- GitHub Pages deployment should run only after CI succeeds on `main`.
