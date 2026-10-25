# KINETIK — Train With Intent

**A photo-led fitness concept with an interactive 3D equipment lab.**

- Live site: https://mahitech580.github.io/3D-fitness-website/
- Source: https://github.com/mahitech580/3D-fitness-website
- [CI workflow](https://github.com/mahitech580/3D-fitness-website/actions/workflows/ci.yml) · [Pages deployment](https://github.com/mahitech580/3D-fitness-website/actions/workflows/deploy.yml)

## Experience

- **3D training lab:** custom barbell, dumbbell, and kettlebell models; drag to orbit, zoom, toggle automatic rotation, and reset the camera.
- **Training paths:** goal tabs for strength, conditioning, and mobility, with keyboard navigation and a direct hand-off to the plan builder.
- **Session blueprint:** four-stage arrive / prepare / practise / reset guide with flexible time ranges and responsive cards.
- **Weekly rhythm:** filterable sample schedule covering strength, conditioning, and recovery days.
- **Habit tracker:** record sessions for the current local week; check-ins stay in this browser.
- **Starter-plan builder:** create a transparent, rule-based example routine from goal, starting level, and time available.
- **Editorial experience:** layered gym photography, oversized typography, scroll reveals, a photo moodboard, recovery content, and responsive layouts.
- **Accessibility basics:** semantic page sections, keyboard-focus styles, a skip link, reduced-motion support, a mobile navigation menu, and a CSS preview when WebGL is unavailable.

## Stack

React 19, TypeScript, Vite 8, Framer Motion, Three.js, React Three Fiber, Drei, and Playwright for browser smoke tests. GitHub Pages hosts the static build; GitHub Actions runs checks before the deployment workflow is allowed to publish.

## Run locally

Use Node.js 24 (the project requires Node.js 20.19 or newer).

\`\`\`bash
npm install
npm run dev
\`\`\`

Production and artifact checks:

\`\`\`bash
npm run check
\`\`\`

Browser interaction tests require the Playwright Chromium binary:

\`\`\`bash
npx playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4173
\`\`\`

In a second terminal, run the smoke test against the local preview root:

\`\`\`bash
PREVIEW_URL=http://127.0.0.1:4173/ npm run test:browser
\`\`\`

\`npm run check:all\` runs both the production checks and browser smoke script once Chromium is installed. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution and verification workflow.

## Data, privacy, and limits

KINETIK is a website concept, not an operating gym, coaching service, or medical service. It has no account system, backend, bookings, memberships, payment processing, live timetable, hosted AI coach, camera-based tracking, or cloud synchronization. The routine builder is a fixed rule-based template, not AI. Check-ins and generated plans use browser-local storage when available.

The page uses remote Unsplash images, so those photos require an internet connection. Review the applicable [Unsplash license](https://unsplash.com/license) and replace remote photos with appropriately licensed local assets before a commercial deployment. The exact image IDs and layout references are documented in [docs/ASSET-CREDITS.md](docs/ASSET-CREDITS.md) and [docs/REFERENCE-RESEARCH.md](docs/REFERENCE-RESEARCH.md).

## Implementation notes

The active 3D canvas is deferred until the lab approaches the viewport and released while it is offscreen. The renderer uses a bounded device-pixel ratio, reduced-motion-aware rotation, and a styled CSS preview while WebGL initializes or is unavailable. The build separates the on-demand 3D experience from the first page render.

\`npm run check\` validates the built HTML, metadata, generated assets, key sections, responsive styles, and the 3D model source. The CI workflow then installs Chromium and exercises the interactive site in a headless browser before the deployment workflow runs.
