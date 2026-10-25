# KINETIK — Train With Intent

**A photo-led fitness concept with an interactive 3D equipment lab.**

- Live site: https://mahitech580.github.io/3D-fitness-website/
- Source: https://github.com/mahitech580/3D-fitness-website
- [CI workflow](https://github.com/mahitech580/3D-fitness-website/actions/workflows/ci.yml) · [Pages deployment](https://github.com/mahitech580/3D-fitness-website/actions/workflows/deploy.yml)

## Experience

- **3D training lab:** custom barbell, dumbbell, and kettlebell models; drag to orbit, zoom, toggle automatic rotation, and reset the camera.
- **Live material configurator:** switch the active 3D model between Kinetik lime, matte Carbon, and brushed Steel finishes; the real-time model updates without replacing the WebGL canvas.
- **Camera presets:** switch the live camera between Hero angle, Front, and Side profile for quick model inspection.
- **Lighting studio:** compare Studio, Contrast, and Neon light rigs by changing actual Three.js scene lights without reloading the canvas.
- **Guided 3D story:** step through Form, Finish, and Detail beats; each beat adjusts the camera and model presentation to give the lab a deliberate product-story arc.
- **Shareable scene presets:** use **Copy setup link** to share the selected equipment, finish, lighting rig, camera angle, and story beat. Opening the link restores that configuration from URL query parameters.
- **Training paths:** goal tabs for strength, conditioning, and mobility, with keyboard navigation and a direct hand-off to the plan builder.
- **Session blueprint:** four-stage arrive / prepare / practise / reset guide with flexible time ranges and responsive cards.
- **Movement index:** searchable 12-movement reference with strength, conditioning, and mobility/reset filters, equipment cues, responsive cards, and a clear no-results reset.
- **Weekly rhythm:** filterable sample schedule covering strength, conditioning, and recovery days.
- **Habit tracker:** record sessions for the current local week; check-ins stay in this browser.
- **Starter-plan builder:** create a transparent, rule-based example routine from goal, starting level, and time available.
- **Portable starter plans:** copy a generated routine as clean, numbered plain text with an accessible status message and a fallback for browsers that block clipboard access.
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

The browser smoke suite covers movement search/filter states, 3D equipment and scene presets, keyboard-accessible tabs, plan generation/copy feedback, local tracker persistence and toggle behavior, image alt attributes, in-page link targets, Escape-to-close mobile navigation, and mobile overflow. Browser interaction tests require the Playwright Chromium binary:

\`\`\`bash
npx playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4173
\`\`\`

In a second terminal, run the smoke test against the local preview root:

\`\`\`bash
PREVIEW_URL=http://127.0.0.1:4173/ npm run test:browser
\`\`\`

\`npm run check:all\` runs both the production checks and browser smoke script once Chromium is installed. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution and verification workflow, and [docs/QUALITY-CHECKLIST.md](docs/QUALITY-CHECKLIST.md) for the regression and release checklist.

## Data, privacy, and limits

KINETIK is a website concept, not an operating gym, coaching service, or medical service. It has no account system, backend, bookings, memberships, payment processing, live timetable, hosted AI coach, camera-based tracking, or cloud synchronization. The routine builder is a fixed rule-based template, not AI. Check-ins and generated plans use browser-local storage when available.

The page uses remote Unsplash images, so those photos require an internet connection. Review the applicable [Unsplash license](https://unsplash.com/license) and replace remote photos with appropriately licensed local assets before a commercial deployment. The exact image IDs and layout references are documented in [docs/ASSET-CREDITS.md](docs/ASSET-CREDITS.md) and [docs/REFERENCE-RESEARCH.md](docs/REFERENCE-RESEARCH.md).

## Implementation notes

The active 3D canvas is deferred until the lab approaches the viewport and released while it is offscreen. The renderer uses a bounded device-pixel ratio, reduced-motion-aware rotation, and a styled CSS preview while WebGL initializes or is unavailable. The build separates the on-demand 3D experience from the first page render.

\`npm run check\` validates the built HTML, metadata, generated assets, key sections, responsive styles, and the 3D model source. The CI workflow then installs Chromium and exercises the interactive site in a headless browser before the deployment workflow runs.
